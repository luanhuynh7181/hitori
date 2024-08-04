import { DataCell } from "./DataCell";

export class DataBoard {
    private _board: DataCell[][] = [];

    public createBoard(boardJson: number[][]) {
        for (const row of boardJson) {
            const cellsRow: DataCell[] = [];
            for (const cellValue of row) {
                const cell = new DataCell(cellValue);
                cellsRow.push(cell);
            }
            this.board.push(cellsRow);
        }
    }

    public get board(): DataCell[][] {
        return this._board;
    }

    public updateValue(row: number, col: number, value: number) {
        this.board[row][col].value = value;
    }

}
