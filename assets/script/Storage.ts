import CrazySDK from "../CrazySDK/CrazySDK";
import { GAME_ANALYTICS } from "../GameAnalytics/GameAnalytics";
import { isModeDev } from "./Constant";
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

    loadData() {
        const data = this.getItem("data");
        if (data) {
            this.data = JSON.parse(data);
        }
    }

    getItem(key: string): any {
        if (isModeDev) {
            return localStorage.getItem(key);
        }
        return CrazySDK.data.getItem(key);;
    }

    setItem(key: string, value: string) {
        if (isModeDev) {
            localStorage.setItem(key, value);
            return;
        }
        CrazySDK.data.setItem(key, value);

    }

    getData(key: string): string | null {
        return this.data[key] || null;
    }

    getKeyBoard(boardInfo: BoardInfo): string {
        return `pack_${boardInfo.packType}_size${boardInfo.boardSize}_index${boardInfo.boardIndex}`;
    }

    isBoardFinished(boardInfo: BoardInfo): boolean {
        const key = this.getKeyBoard(boardInfo);
        return this.getData(key) != null;
    }

    isFinishAllBoardSize(boardSize: number, length: number): boolean {
        for (let i = 0; i < length; i++) {
            const boardInfo: BoardInfo = { packType: PACK_TYPE.CLASSIC, boardSize, boardIndex: i };
            if (!this.isBoardFinished(boardInfo)) {
                return false;
            }
        }
        return true;
    }

    cacheBoardFinished(boardInfo: BoardInfo, timeFinish: number) {
        const key = this.getKeyBoard(boardInfo);
        this.data[key] = timeFinish;
        GAME_ANALYTICS.trackTimeFinishBoard(boardInfo, timeFinish);
        this.setItem("data", JSON.stringify(this.data));
    }

    isFirstTimePlay() {
        const key = "first_time_play12";
        const b = this.getItem(key) == null;
        this.setItem(key, "1");
        return b;
    }

}

export const LocalStorage = _LocalStorage.getInstance();


