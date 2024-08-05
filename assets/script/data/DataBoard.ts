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

    public isvalidCoords(coords: Tcoords): boolean {
        return this.getCellAroundInvalid(coords).length === 0;
    }

    public getCellAroundInvalid(coords: Tcoords): Tcoords[] {
        const result: Tcoords[] = [];
        const director: Tcoords[] = Utility.getCellAround(coords, this.board);
        for (const dir of director) {
            if (this.board[dir.row][dir.column].isShaded) {
                result.push(dir);
            }
        }
        return result;
    }
}
