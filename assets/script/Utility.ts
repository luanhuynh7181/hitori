import DataConfig from "./board/DataConfig";
import PackConfig from "./board/PackConfig";
import { PACK_TYPE } from "./Enum";
import { LocalStorage } from "./Storage";
import { BoardInfo, Tcoords } from "./Type";


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

    public static getNextBoard(): BoardInfo {
        const pack: PackConfig = DataConfig.getPackConfig(PACK_TYPE.CLASSIC);
        const a = pack.getBoardConfigSortedBySize();
        for (const { size, boardConfig } of pack.getBoardConfigSortedBySize()) {
            for (let i = 0; i < boardConfig.length; i++) {
                const boardInfo: BoardInfo = { packType: PACK_TYPE.CLASSIC, boardSize: size, boardIndex: i };
                if (!LocalStorage.isBoardFinished(boardInfo)) {
                    return boardInfo;
                }
            }
        }
        return null;
    }

    public static getBoardFinishInfo(): { total: number, finished: number } {
        const pack: PackConfig = DataConfig.getPackConfig(PACK_TYPE.CLASSIC);
        let total = 0;
        let finished = 0;
        for (const { size, boardConfig } of pack.getBoardConfigSortedBySize()) {
            total += boardConfig.length;
            for (let i = 0; i < boardConfig.length; i++) {
                const boardInfo: BoardInfo = { packType: PACK_TYPE.CLASSIC, boardSize: size, boardIndex: i };
                if (LocalStorage.isBoardFinished(boardInfo)) {
                    finished++;
                }
            }
        }
        return { total, finished };
    }
}