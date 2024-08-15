import { _decorator, clamp, Component, director, EventTouch, instantiate, Label, Node, Prefab, UI, UITransform, v3, Vec2 } from 'cc';
import { DataBoard } from '../../data/DataBoard';
import { BoardMouse } from '../../ui/BoardMouse';
import { UICell } from '../../ui/ui_cell/UICell';
import { Signal } from '../../design/Signal';
import { ChangeTypeHistory } from '../../design/history/ChangeTypeHistory';
import { IDataCell } from '../../data/DataCell';
import { BoardInfo, Tcoords } from '../../Type';
import { ChangeTypeCommand } from '../../design/history/ChangeTypeCommand';
import { Utility } from '../../Utility';
import BoardConfig from '../../board/BoardConfig';
import DataConfig from '../../board/DataConfig';
import { EVENT_TYPE, GAME_LAYOUT } from '../../Enum';
import { Transition } from '../../effect/Transition';

const { ccclass, property } = _decorator;

@ccclass('LayoutGame')
export class LayoutGame extends Component {

    @property(Prefab) cellPrefab: Prefab = null;
    @property(Node) nodeBoardGame: Node = null;
    @property(Node) nodeBg: Node = null;
    @property(Node) imgTarget: Node = null;
    @property(Node) btnUndo: Node = null;
    @property(Node) btnNext: Node = null;
    @property(Node) btnHelp: Node = null;
    @property(Node) nodeTop: Node = null;
    @property(Node) nodeInfo: Node = null;

    private poolUIcell: Node[] = [];

    private dataBoard: DataBoard = new DataBoard();
    private toucher: BoardMouse = null;
    private cells: UICell[][] = [];
    private changeTypeCommand: ChangeTypeHistory = new ChangeTypeHistory();
    private transition: Transition = new Transition();

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
    }

    addTransition() {
        this.transition.addTransition(this.nodeTop, 0, 100)
            .addTransition(this.nodeInfo, -100)
            .addTransition(this.nodeBg, 0, 100)
            .addTransition(this.nodeBoardGame, 0, 100)
    }

    onShow(boardInfo: BoardInfo) {
        this.node.active = true;
        this.clearDataAndUI();
        this.transition.runIn();
        const boardConfig: BoardConfig = DataConfig.getBoardConfig(boardInfo);
        this.updateLayoutBoard(boardConfig.data.length);
        this.dataBoard.createBoard(boardConfig.data);
        this.createUICell();
        this.addToHistory();
    }

    preloadUICell() {
        for (let i = 0; i < 400; i++) {
            const node: Node = instantiate(this.cellPrefab);
            node.active = false;
            this.nodeBoardGame.addChild(node);
            this.poolUIcell.push(node);
        }
    }

    updateLayoutBoard(size: number) {
        const max = 450;
        const min = 300;
        const minSize = 4;
        const maxSize = 20
        const width = (max - min) / (maxSize - minSize) * (size - minSize) + min;
        this.nodeBoardGame.getComponent(UITransform).width = width;
        this.nodeBoardGame.getComponent(UITransform).height = width;
        this.nodeBg.getComponent(UITransform).width = width + 15;
        this.nodeBg.getComponent(UITransform).height = width + 15;
        this.btnNext.setPosition(80, -width / 2 - 45);
        this.btnUndo.setPosition(-80, -width / 2 - 45);
    }

    clearDataAndUI() {
        for (const node of this.poolUIcell) {
            node.active = false;
        }
        this.cells = [];
        this.changeTypeCommand = new ChangeTypeHistory();
        this.dataBoard = new DataBoard();
    }

    createUICell() {
        const board: IDataCell[][] = this.dataBoard.board;
        const padding: number = 3;
        const boardWidth = this.nodeBoardGame.getComponent(UITransform).width;
        const cellSize = boardWidth / board.length;
        const posStart: Vec2 = new Vec2(-boardWidth / 2 + cellSize / 2, boardWidth / 2 - cellSize / 2);
        let uiCellIndex = 0;
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            const uiRow: UICell[] = [];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                const node: Node = this.poolUIcell[uiCellIndex++];
                node.active = true;
                const uiCell: UICell = node.getComponent(UICell);
                const coords: Tcoords = { row: i, column: j };
                uiCell.setup(coords, cell);
                uiRow.push(uiCell);
                node.setPosition(posStart.x + j * cellSize, posStart.y - i * cellSize);
                uiCell.updateSize(cellSize - padding);
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
        const command: ChangeTypeCommand = this.changeTypeCommand.undo();
    }

    nextAction() {
        const command: ChangeTypeCommand = this.changeTypeCommand.next();
    }

    checkWin() {
        if (this.dataBoard.isWin()) {
            this.nodeBoardGame.active = false;
        }
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

    showValidNumber() {
        // this.dataBoard.showValidNumber();
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
        });

    }

    onClickHelp() {
        const invalidCoords = this.dataBoard.getCoordsInvald();
        for (const coords of invalidCoords) {
            const cell: UICell = this.getCell(coords);
            cell.showCellValidNumber();
        }
    }
}
