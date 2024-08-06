import { _decorator, clamp, Component, EventTouch, instantiate, Node, Prefab, UI, UITransform, v3, Vec2 } from 'cc';
import { IDataCell } from '../data/DataCell';
import { DataBoard } from '../data/DataBoard';
import { UICell } from './ui_cell/UICell';
import { BoardMouse } from './BoardMouse';
import { SignalChangeType, Tcoords } from '../Type';
import { Signal } from '../design/Signal';
import { ChangeTypeCommand } from '../design/history/ChangeTypeCommand';
import { ChangeTypeHistory } from '../design/history/ChangeTypeHistory';
import { CELL_TYPE } from '../Enum';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('BoardGame')
export class BoardGame extends Component {

    @property(Prefab) cellPrefab: Prefab = null;
    private dataBoard: DataBoard = new DataBoard();
    private toucher: BoardMouse = null;
    private cells: UICell[][] = [];
    private signalChangeType: Signal<SignalChangeType> = new Signal<SignalChangeType>();
    private changeTypeCommand: ChangeTypeHistory = new ChangeTypeHistory();

    start() {
        const grid = [
            [4, 2, 5, 2, 4],
            [4, 5, 2, 5, 1],
            [2, 1, 1, 4, 2],
            [1, 4, 1, 3, 2],
            [1, 5, 2, 2, 1]
        ];
        this.dataBoard.createBoard(grid);
        this.createUICell();
        this.toucher = new BoardMouse(
            this.node,
            this.dataBoard,
            this.onHoverCell.bind(this),
            this.onLeftClick.bind(this),
            this.onRightClick.bind(this));
    }

    createUICell() {
        const board: IDataCell[][] = this.dataBoard.board;
        const padding: number = 3;
        const boardWidth = this.node.getComponent(UITransform).width;
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
                this.node.addChild(uiCell.node);
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
        this.updatePriorityValidAtCell(coords);
        this.updateCellNonShadeOnBoard();
        this.updateUIAllCell();
        this.addToHistory();
        this.checkWin();
    }

    onChangeFlag(coords: Tcoords) {
        const uiCell: UICell = this.getCell(coords);
    }

    addToHistory() {
        // const command = new ChangeTypeCommand(uiCell, signal.typeChange);
        // this.changeTypeCommand.executeCommand(command);
    }

    updateUIAllCell() {
        for (const row of this.cells) {
            for (const cell of row) {
                cell.updateUIByPriority();
            }
        }
    }

    updatePriorityValidAtCell(coords: Tcoords, checker: Map<string, boolean> = new Map<string, boolean>()) {

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
                this.updatePriorityValidAtCell(dir, checker);
            }
        }
    }


    updateCellNonShadeOnBoard() {
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
        // const command: ChangeTypeCommand = this.changeTypeCommand.undo();
        // console.log("undoAction", command !== undefined);
        // if (command) {
        //     this.updateCellAround(command.actor.coords);
        // }
    }

    nextAction() {
        // const command: ChangeTypeCommand = this.changeTypeCommand.next();
        // console.log("nextAction", command !== undefined);
        // if (command) {
        //     this.updateCellAround(command.actor.coords);
        // }
    }

    checkWin() {
        if (this.dataBoard.isWin()) {
            this.node.active = false;
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
        this.onChangeShade(coords);
    }

    onRightClick(coords: Tcoords) {
        const cell: UICell = this.getCell(coords);
        cell.priority.isFlag = !cell.priority.isFlag;
        this.onChangeFlag(coords);
    }
}


