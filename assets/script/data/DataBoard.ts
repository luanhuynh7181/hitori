import { Tcoords } from "../Type";
import { Utility } from "../Utility";
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

    public isvalidCoord(coords: Tcoords): boolean {
        const director: Tcoords[] = Utility.getAllDirection();
        for (const dir of director) {
            const newRow = coords.row + dir.row;
            const newCol = coords.column + dir.column;
            if (newRow < 0 || newRow >= this.board.length || newCol < 0 || newCol >= this.board.length) {
                continue;
            }
            if (this.board[newRow][newCol].isShaded) {
                return false;
            }
        }
        return true;
    }

    // public 
}
