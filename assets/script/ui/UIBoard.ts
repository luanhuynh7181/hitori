import { _decorator, Component, Node } from 'cc';
import { DataCell } from '../data/DataCell';
const { ccclass, property } = _decorator;

@ccclass('BoardGame')
export class BoardGame extends Component {
    private cells: DataCell[][] = [];
    start() {
        const grid = [
            [1, 5, 1, 2, 3],
            [1, 4, 5, 5, 1],
            [3, 3, 5, 4, 1],
            [3, 2, 1, 1, 3],
            [5, 5, 2, 3, 4]
        ];
        this.createBoard(grid);
    }

    createBoard(boardJson: number[][]) {
        for (const row of boardJson) {
            const cellsRow: DataCell[] = [];
            for (const cellValue of row) {
                const cell = new DataCell(cellValue);
                cellsRow.push(cell);
            }
            this.cells.push(cellsRow);
        }
    }

    update(deltaTime: number) {

    }
}


