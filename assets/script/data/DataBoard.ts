import { Tcoords } from "../Type";
import { Utility } from "../Utility";
import { IDataCell } from "./DataCell";

export class DataBoard {
    private _board: IDataCell[][] = [];
    public createBoard(boardJson: number[][]) {
        for (const row of boardJson) {
            const cellsRow: IDataCell[] = [];
            for (const cellValue of row) {
                const cell = { value: cellValue, isShaded: false };
                cellsRow.push(cell);
            }
            this.board.push(cellsRow);
        }
    }

    public get board(): IDataCell[][] {
        return this._board;
    }

    public updateValue(row: number, col: number, value: number) {
        this.board[row][col].value = value;
    }

    public isvalidCoords(coords: Tcoords): boolean {
        if (!this.board[coords.row][coords.column].isShaded) return true;
        return this.getCellAroundInvalid(coords).length === 0;
    }

    isValidAllCoords(): boolean {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (!this.isvalidCoords({ row: i, column: j })) {
                    return false;
                }
            }
        }
        return true;
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

    public isvalidArea(): boolean {
        return this.getAreas().length === 1;
    }

    public getAreas(): Tcoords[][] {
        const result: Tcoords[][] = [];
        const copyBoard: IDataCell[][] = JSON.parse(JSON.stringify(this.board));
        for (let i = 0; i < copyBoard.length; i++) {
            for (let j = 0; j < copyBoard[i].length; j++) {
                if (!copyBoard[i][j].isShaded) {
                    result.push(this.getArea({ row: i, column: j }, copyBoard));
                }
            }
        }
        return result;
    }

    public getArea(coords: Tcoords, copyBoard: IDataCell[][]): Tcoords[] {
        const result: Tcoords[] = [coords];
        copyBoard[coords.row][coords.column].isShaded = true;
        const director: Tcoords[] = Utility.getCellAround(coords, copyBoard);
        for (const dir of director) {
            if (!copyBoard[dir.row][dir.column].isShaded) {
                result.push(...this.getArea(dir, copyBoard));
            }
        }
        return result;
    }

    isValidNumber(): boolean {
        const map = new Map<string, boolean>();
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j].isShaded) continue;
                const value = this.board[i][j].value;
                const hashCol = `row_${i}_${value}`;
                if (map.has(hashCol)) return false;
                const hashRow = `col_${j}_${value}`;
                if (map.has(hashRow)) return false;
                map.set(hashRow, true);
                map.set(hashCol, true);
            }
        }
        return true;
    }

    isWin(): boolean {
        if (!this.isvalidArea()) return false;
        if (!this.isValidAllCoords()) return false;
        if (!this.isValidNumber()) return false;
        return true;
    }
}
