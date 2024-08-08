import { _decorator, clamp, Component, director, EventTouch, instantiate, Node, Prefab, UI, UITransform, v3, Vec2 } from 'cc';
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

const { ccclass, property } = _decorator;

@ccclass('LayoutGame')
export class LayoutGame extends Component {

    @property(Prefab) cellPrefab: Prefab = null;
    @property(Node) nodeBoardGame: Node = null;
    @property(Node) nodeBg: Node = null;
    private dataBoard: DataBoard = new DataBoard();
    private toucher: BoardMouse = null;
    private cells: UICell[][] = [];
    private changeTypeCommand: ChangeTypeHistory = new ChangeTypeHistory();

    onLoad() {
        this.toucher = new BoardMouse(
            this.nodeBoardGame,
            this.dataBoard,
            this.onHoverCell.bind(this),
            this.onLeftClick.bind(this),
            this.onRightClick.bind(this));
    }

    onShow(boardInfo: BoardInfo) {
        this.clear()
        const boardConfig: BoardConfig = DataConfig.getBoardConfig(boardInfo);
        const max = 900;
        const min = 500;
        const width = (max - min) / 16 * boardConfig.data.length + min;
        this.nodeBoardGame.getComponent(UITransform).width = width;
        this.nodeBoardGame.getComponent(UITransform).height = width;

        this.nodeBg.getComponent(UITransform).width = width + 20;
        this.nodeBg.getComponent(UITransform).height = width + 30;
        this.nodeBoardGame.active = true;
        this.dataBoard.createBoard(boardConfig.data);
        console.log(this.dataBoard);
        this.toucher.updateDataBoard(this.dataBoard);
        this.createUICell();
        this.addToHistory();
    }

    clear() {
        for (const row of this.cells) {
            for (const cell of row) {
                cell.node.destroy();
            }
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
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            const uiRow: UICell[] = [];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                const node: Node = instantiate(this.cellPrefab);
                const uiCell: UICell = node.getComponent(UICell);
                const coords: Tcoords = { row: i, column: j };
                uiCell.setup(coords, cell);
                uiRow.push(uiCell);
                this.nodeBoardGame.addChild(uiCell.node);
                node.setPosition(posStart.x + j * cellSize, posStart.y - i * cellSize);
                uiCell.updateSize(cellSize - padding);
            }
            this.cells.push(uiRow);
        }
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

    onHoverCell(coords: Tcoords) {
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
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.LOBBY, data: null });
    }

}
