import { _decorator, clamp, Component, EventTouch, instantiate, Node, Prefab, UI, UITransform, v3, Vec2 } from 'cc';
import { IDataCell } from '../data/DataCell';
import { DataBoard } from '../data/DataBoard';
import { UICell } from './ui_cell/UICell';
import { BoardToucher } from './BoardToucher';
import { SignalChangeType, Tcoords } from '../Type';
import { Signal } from '../design/Observer';
import { ChangeTypeCommand } from '../design/history/ChangeTypeCommand';
import { ChangeTypeHistory } from '../design/history/ChangeTypeHistory';
import { CELL_TYPE } from '../Enum';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('BoardGame')
export class BoardGame extends Component {

    @property(Prefab) cellPrefab: Prefab = null;
    private dataBoard: DataBoard = new DataBoard();
    private toucher: BoardToucher = null;
    private cells: UICell[][] = [];
    private signalChangeType: Signal<SignalChangeType> = new Signal<SignalChangeType>();
    private changeTypeCommand: ChangeTypeHistory = new ChangeTypeHistory();

    start() {
        const grid = [
            [1, 5, 1, 2, 3],
            [1, 4, 5, 5, 1],
            [3, 3, 5, 4, 1],
            [3, 2, 1, 1, 3],
            [5, 5, 2, 3, 4]
        ];
        this.dataBoard.createBoard(grid);
        this.createUICell();
        this.toucher = new BoardToucher(this.node, this.dataBoard);
        this.signalChangeType.addHandler(this.onChangeType, this);
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
                uiCell.setup(coords, cell, this.signalChangeType);
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

    onChangeType(signal: SignalChangeType) {
        console.log("onChangeType", signal);
        const uiCell: UICell = this.getCell(signal.coords);
        const command = new ChangeTypeCommand(uiCell, signal.typeChange);
        this.changeTypeCommand.executeCommand(command);
        this.updateCellAround(signal.coords);
        this.updateCellArea();
    }

    updateCellAround(coords: Tcoords, checker: Map<string, boolean> = new Map<string, boolean>()) {
        const keyCheck = `${coords.row}_${coords.column}`;
        if (checker.has(keyCheck)) return;
        checker.set(keyCheck, true);
        const uiCell: UICell = this.getCell(coords);
        if (uiCell.dataCell.isShaded) {
            const isValid = this.dataBoard.isvalidCoords(coords);
            uiCell.onChangeType(isValid ? CELL_TYPE.SHADED : CELL_TYPE.INVALID_COORDS);
        }
        const director: Tcoords[] = Utility.getCellAround(coords, this.cells);
        for (const dir of director) {
            const cell = this.getCell(dir);
            cell.dataCell.isShaded && this.updateCellAround(dir, checker);
        }
    }

    updateCellArea() {
        const areas: Tcoords[][] = this.dataBoard.getAreas();
        areas.sort((a, b) => b.length - a.length);
        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];
            const type = i == 0 ? CELL_TYPE.NONE_SHADE : CELL_TYPE.INVALID_AREA;
            for (const coords of area) {
                const cell: UICell = this.getCell(coords);
                cell.onChangeType(type);
            }
        }
    }

    undoAction() {
        const command: ChangeTypeCommand = this.changeTypeCommand.undo();
        console.log("undoAction", command !== undefined);
        if (command) {
            this.updateCellAround(command.actor.coords);
        }
    }

    nextAction() {
        const command: ChangeTypeCommand = this.changeTypeCommand.next();
        console.log("nextAction", command !== undefined);
        if (command) {
            this.updateCellAround(command.actor.coords);
        }
    }
}


