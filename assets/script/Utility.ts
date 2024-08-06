import { Tcoords } from "./Type";


export class Utility {
    private static direction: Tcoords[] = [
        { row: -1, column: 0 },
        { row: 1, column: 0 },
        { row: 0, column: -1 },
        { row: 0, column: 1 }
    ];
    public static getCellAround(coords: Tcoords, board: any[][]): Tcoords[] {
        const result: Tcoords[] = [];
        for (const dir of this.direction) {
            const newRow = coords.row + dir.row;[]
            const newCol = coords.column + dir.column;
            if (newRow >= 0 && newCol >= 0 && newRow < board.length && newCol < board[0].length) {
                result.push({ row: newRow, column: newCol });
            }
        }
        return result;
    }
}