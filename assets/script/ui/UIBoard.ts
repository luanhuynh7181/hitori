import { _decorator, clamp, Component, EventTouch, instantiate, Node, Prefab, UITransform, v3, Vec2 } from 'cc';
import { DataCell } from '../data/DataCell';
import { DataBoard } from '../data/DataBoard';
import { UICell } from './ui_cell/UICell';
import { BoardToucher } from './BoardToucher';
import { SignalChangeType, Tcoords } from '../Type';
import { Signal } from '../design/Observer';
import { ChangeTypeCommand } from '../design/history/ChangeTypeCommand';
import { ChangeTypeHistory } from '../design/history/ChangeTypeHistory';
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
        const board: DataCell[][] = this.dataBoard.board;
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
                node.setPosition(posStart.x + i * cellSize, posStart.y - j * cellSize);
                uiCell.updateSize(cellSize - padding);
            }
            this.cells.push(uiRow);
        }
    }

    onChangeType(signal: SignalChangeType) {
        const uiCell: UICell = this.cells[signal.coords.row][signal.coords.column];
        const command = new ChangeTypeCommand(uiCell, signal.typeChange);
        this.changeTypeCommand.executeCommand(command);
    }

    undoAction() {
        const success = this.changeTypeCommand.undo();
    }

    nextAction() {
        const success = this.changeTypeCommand.next();
    }
}


