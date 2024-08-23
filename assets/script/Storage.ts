import { PACK_TYPE } from "./Enum";
import { BoardInfo } from "./Type";

export class _LocalStorage {
    private static instance: _LocalStorage;
    public static getInstance(): _LocalStorage {
        if (!this.instance) {
            this.instance = new _LocalStorage();
        }
        return this.instance;
    }

    private data: any = {};
    constructor() {

    }

    getItem(key: string): string | null {
        return this.data[key] || null;
    }

    setItem(key: string, value: string): void {
        this.data[key] = value;
    }

    getKeyBoard(boardInfo: BoardInfo): string {
        return `pack_${boardInfo.packType}_size${boardInfo.boardSize}_index${boardInfo.boardIndex}`;
    }

    isBoardFinished(boardInfo: BoardInfo): boolean {
        const key = this.getKeyBoard(boardInfo);
        return this.getItem(key) === '1';
    }

    isFinishAllBoardSize(boardSize: number): boolean {
        for (let i = 0; i < boardSize; i++) {
            const boardInfo: BoardInfo = { packType: PACK_TYPE.CLASSIC, boardSize, boardIndex: i };
            if (!this.isBoardFinished(boardInfo)) {
                return false;
            }
        }
        return true;
    }

    cacheBoardFinished(boardInfo: BoardInfo) {
        const key = this.getKeyBoard(boardInfo);
        this.setItem(key, '1');
    }

}

export const LocalStorage = _LocalStorage.getInstance();


