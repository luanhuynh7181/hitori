import { _decorator, clamp, Component, director, EventTouch, instantiate, Label, math, Node, Prefab, Sprite, UI, UITransform, v3, Vec2, Vec3, view, Widget } from 'cc';
import { DataBoard } from '../../data/DataBoard';
import { BoardMouse } from '../../ui/BoardMouse';
import { UICell } from '../../ui/ui_cell/UICell';
import { ChangeTypeHistory } from '../../design/history/ChangeTypeHistory';
import { IDataCell } from '../../data/DataCell';
import { BoardInfo, Tcoords } from '../../Type';
import { ChangeTypeCommand } from '../../design/history/ChangeTypeCommand';
import { Utility } from '../../Utility';
import BoardConfig from '../../board/BoardConfig';
import DataConfig from '../../board/DataConfig';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../../Enum';
import { Transition } from '../../effect/Transition';
import { LocalStorage } from '../../Storage';
import { LayoutGameTut } from './LayoutGameTut';
import { NodeTimer } from '../../nodeComponent/NodeTimer';
import { PopupTut } from '../../nodeComponent/PopupTut';
import { SceneGame } from '../SceneGame';
import { PopupWin } from '../../nodeComponent/PopupWin';
import { PopupAds } from '../../nodeComponent/PopupAds';

const { ccclass, property } = _decorator;

@ccclass('LayoutGame')
export class LayoutGame extends Component {

    @property(Prefab) cellPrefab: Prefab = null;
    @property(Prefab) popupTut: Prefab = null;
    @property(Prefab) popupWin: Prefab = null;
    @property(Prefab) popupAds: Prefab = null;

    @property(Node) nodeBoardGame: Node = null;
    @property(Node) imgBorder: Node = null;
    @property(Node) imgTarget: Node = null;
    @property(Node) nodeLeft: Node = null;
    @property(Node) nodeBtn: Node = null;
    @property(Node) nodeCellUI: Node = null;
    @property(NodeTimer) scriptTime: NodeTimer = null;
    @property(Sprite) spriteUndo: Sprite = null;
    @property(Sprite) spriteNext: Sprite = null;
    @property(Label) lbBoardSize: Label = null;
    @property(Label) lbBoardIndex: Label = null;

    poolUIcell: Node[] = [];
    dataBoard: DataBoard = new DataBoard();
    toucher: BoardMouse = null;
    cells: UICell[][] = [];
    changeTypeCommand: ChangeTypeHistory = new ChangeTypeHistory();
    transition: Transition = new Transition();
    boardInfo: BoardInfo = null;
    layoutTutorial: LayoutGameTut = null;
    nodePopupWin: Node = null;
    nodePopupAds: Node = null;

    onLoad() {
        this.toucher = new BoardMouse(
            this.nodeBoardGame,
            this.cells,
            this.imgTarget,
            this.onLeftClick.bind(this),
            this.onRightClick.bind(this)
        );

        this.preloadUICell();
        this.addTransition();
        director.on(EVENT_TYPE.FINISH_WATCH_ADS, this.onWatchedAds, this);
    }

    onResize(designeResolution: math.Size, visibleSize: math.Size) {
        this.node.getComponent(UITransform).setContentSize(visibleSize);

        this.nodeLeft.getComponent(Widget).updateAlignment();
        this.transition.updateOrgPos(this.nodeLeft);

        const sizeNodeLeft = this.nodeLeft.getComponent(UITransform).width;
        this.nodeBoardGame.setPosition((visibleSize.width - sizeNodeLeft) / 2 + sizeNodeLeft - visibleSize.width / 2, 0);
        this.transition.updateOrgPos(this.nodeBoardGame);

        this.nodeBtn.getComponent(Widget).updateAlignment();
        this.transition.updateOrgPos(this.nodeBtn);
        this.layoutTutorial?.onResize(visibleSize, this.nodeBoardGame);
    }

    addTransition() {
        this.transition
            .addTransition(this.nodeLeft, -200, 0)
            .addTransition(this.nodeBoardGame, 200, 0)
            .addTransition(this.nodeBtn, 0, 200)
    }

    onShow(boardInfo: BoardInfo) {
        this.boardInfo = boardInfo;
        const boardConfig: BoardConfig = DataConfig.getBoardConfig(boardInfo);
        this.updateLayoutBoard(boardConfig.data.length);
        this.dataBoard.createBoard(boardConfig.data);
        this.updateInfoBoard();
        this.createUICell();
        this.addToHistory();
        this.scriptTime.onShow();
        this.transition.runIn(
            () => {
                if (LocalStorage.isFirstTimePlay()) {
                    this.onClickTut();
                }
            }
        );
    }

    preloadUICell(maxCell: number = 400) {
        const pos = new Vec3(2000, 200);
        for (let i = 0; i < maxCell; i++) {
            const node: Node = instantiate(this.cellPrefab);
            this.nodeCellUI.addChild(node);
            this.poolUIcell.push(node);
            node.setPosition(pos);
            const uiCell: UICell = node.getComponent(UICell);
            uiCell.clean();
        }
    }

    updateLayoutBoard(size: number) {
        const max = 630;
        const min = 300;
        const minSize = 4;
        const maxSize = 20
        const width = (max - min) / (maxSize - minSize) * (size - minSize) + min;
        this.nodeBoardGame.getComponent(UITransform).width = width;
        this.nodeBoardGame.getComponent(UITransform).height = width;
        const isActive = size < 13;
        this.imgBorder.active = isActive;
        if (!isActive) return;
        this.imgBorder.getComponent(UITransform).width = width + 15;
        this.imgBorder.getComponent(UITransform).height = width + 15;
    }

    updateInfoBoard() {
        const size = this.dataBoard.board.length;
        this.lbBoardSize.string = `${size}x${size}`;
        this.lbBoardIndex.string = (this.boardInfo.boardIndex + 1).toString();
    }

    clearDataAndUI() {
        for (const row of this.cells) {
            for (const cell of row) {
                cell.node.setPosition(2000, 2000);
                cell.clean();
            }
        }
        this.cells = [];
        this.changeTypeCommand = new ChangeTypeHistory();
        this.dataBoard = new DataBoard();
    }

    createUICell() {
        const board: IDataCell[][] = this.dataBoard.board;
        const boardWidth = this.nodeBoardGame.getComponent(UITransform).width;
        const cellSize = boardWidth / board.length;
        const padding: number = cellSize * 0.08;
        const posStart: Vec2 = new Vec2(-boardWidth / 2 + cellSize / 2, boardWidth / 2 - cellSize / 2);
        let uiCellIndex = 0;
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            const uiRow: UICell[] = [];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                const node: Node = this.poolUIcell[uiCellIndex++];
                const uiCell: UICell = node.getComponent(UICell);
                const coords: Tcoords = { row: i, column: j };
                uiCell.setup(coords, cell, cellSize - padding);
                uiRow.push(uiCell);
                node.setPosition(posStart.x + j * cellSize, posStart.y - i * cellSize);
            }
            this.cells.push(uiRow);
        }
        this.toucher.setup(this.cells, cellSize);
    }

    getCell(coords: Tcoords): UICell {
        return this.cells[coords.row][coords.column];
    }

    onChangeShade(coords: Tcoords) {
        this.updatePriorityValidCoords(coords);
        this.updatePriorityValidArea();
        this.updateUIAllCell();
        this.addToHistory();
        this.checkWin();
    }

    onChangeFlag(coords: Tcoords, isChangeShade: boolean) {
        if (isChangeShade) {
            this.updatePriorityValidCoords(coords);
            return;
        }
        this.updateUIAllCell();
        this.addToHistory();
        this.checkWin();
    }

    addToHistory() {
        const command = new ChangeTypeCommand(this.cells);
        this.changeTypeCommand.add(command);
        this.updateStateUndoAndNext();
    }

    updateStateUndoAndNext() {
        const state = this.changeTypeCommand.getState();
        Utility.updateColorSprite(this.spriteUndo, state.canUndo ? "#173438" : "#6B6B6B");
        Utility.updateColorSprite(this.spriteNext, state.canRedo ? "#173438" : "#6B6B6B");
    }

    updateUIAllCell() {
        for (const row of this.cells) {
            for (const cell of row) {
                cell.updateUIByPriority();
            }
        }
    }

    updatePriorityValidCoords(coords: Tcoords, checker: Map<string, boolean> = new Map<string, boolean>()) {

        const keyCheck = `${coords.row}_${coords.column}`;
        if (checker.has(keyCheck)) return;
        checker.set(keyCheck, true);
        const cell = this.getCell(coords);

        if (cell.dataCell.isShaded) {
            cell.priority.isInvalidCoords = !this.dataBoard.isValidCoords(coords);
        }

        const director: Tcoords[] = Utility.getCellAround(coords, this.cells);
        for (const dir of director) {
            const cell = this.getCell(dir);
            if (cell.dataCell.isShaded) {
                this.updatePriorityValidCoords(dir, checker);
            }
        }
    }

    updatePriorityValidArea() {
        const areas: Tcoords[][] = this.dataBoard.getAreas();
        areas.sort((a, b) => b.length - a.length);
        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];
            for (const coords of area) {
                const cell: UICell = this.getCell(coords);
                cell.priority.isInvalidArea = i > 0;
            }
        }
    }

    undoAction() {
        const canUndo = this.changeTypeCommand.getState().canUndo;
        if (!canUndo) return;
        const command: ChangeTypeCommand = this.changeTypeCommand.undo();
        this.updateStateUndoAndNext();
    }

    nextAction() {
        const canRedo = this.changeTypeCommand.getState().canRedo;
        if (!canRedo) return;
        const command: ChangeTypeCommand = this.changeTypeCommand.next();
        this.updateStateUndoAndNext();
    }

    checkWin() {
        if (this.dataBoard.isWin()) {
            if (!this.nodePopupWin) {
                this.nodePopupWin = instantiate(this.popupWin);
                this.node.addChild(this.nodePopupWin);
            }
            this.nodePopupWin.getComponent(PopupWin).show();
            this.scriptTime.stop();
            LocalStorage.cacheBoardFinished(this.boardInfo, this.scriptTime.getTime());
            this.clearDataAndUI();

        }
    }

    createPopupWin() {

    }

    onLeftClick(coords: Tcoords) {
        const cell: UICell = this.getCell(coords);
        cell.dataCell.isShaded = !cell.dataCell.isShaded;
        if (!cell.dataCell.isShaded) {
            cell.priority.isInvalidCoords = false;
        }
        cell.priority.isFlag = false;
        this.onChangeShade(coords);
    }

    onRightClick(coords: Tcoords) {
        const cell: UICell = this.getCell(coords);
        if (cell.priority.isInvalidArea) return;
        if (cell.dataCell.isShaded) return;
        cell.priority.isFlag = !cell.priority.isFlag;
        const isShaded = cell.dataCell.isShaded;
        if (!cell.priority.isFlag) {
            cell.priority.isInvalidArea = false;
        }
        cell.dataCell.isShaded = false;
        this.onChangeFlag(coords, isShaded);
    }

    onClickBack() {
        this.transition.runOut(() => {
            director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.LOBBY, data: null });
            this.clearDataAndUI();
        });

    }

    onClickHelp() {
        if (!this.nodePopupAds) {
            this.nodePopupAds = instantiate(this.popupAds);
            this.node.addChild(this.nodePopupAds);
        }
        this.nodePopupAds.getComponent(PopupAds).show();
        this.scriptTime.stop();
    }

    onClickTut() {
        const nodeTut: Node = instantiate(this.popupTut);
        const nodeGame: Node = instantiate(this.node);
        const layoutGame = nodeGame.getComponent(LayoutGame);
        layoutGame.nodeBtn.removeFromParent();
        layoutGame.nodeLeft.removeFromParent();
        layoutGame.nodeCellUI.removeAllChildren();
        layoutGame.preloadUICell = layoutGame.preloadUICell.bind(layoutGame, 25);
        layoutGame.checkWin = () => { };
        nodeTut.addChild(nodeGame);
        this.node.parent.addChild(nodeTut);
        const popupTut: PopupTut = nodeTut.getComponent(PopupTut);
        this.layoutTutorial = new LayoutGameTut(popupTut, nodeGame, this.node);
        layoutGame.onShow({ packType: PACK_TYPE.CLASSIC, boardSize: 4, boardIndex: 0 });
        this.layoutTutorial.onResize(view.getVisibleSize(), this.nodeBoardGame);
        this.scriptTime.stop();
        this.transition.runOut(() => {
            this.updateOrderTop(nodeTut);
            popupTut.onShow();
        }, 0, [this.nodeBoardGame]);


    }

    updateOrderTop(node: Node) {
        const scene = director.getScene();
        scene.getChildByName("SceneGame").getComponent(SceneGame).setOrderOnTop(node);
    }

    onWatchedAds() {
        const numbersValid = this.dataBoard.getNumbersInvalid();
        for (const coords of numbersValid) {
            const cell = this.getCell(coords);
            cell.priority.isHighlight = true;
            cell.updateUIByPriority();
        }
    }

}
