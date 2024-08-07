import { PACK_TYPE } from "../Constant";
import { BoardInfo } from "../Type";


class _DataChangeScene {
    public static instance = new _DataChangeScene();
    public static getInstance(): _DataChangeScene {
        return this.instance;
    }

    private _boardInfo: BoardInfo = null;
    public set boardInfo(value: BoardInfo) {
        this._boardInfo = value;
    }
    public get boardInfo(): BoardInfo {
        return this._boardInfo;
    }

    private _packType: PACK_TYPE = null;
    public set packType(value: PACK_TYPE) {
        this._packType = value;
    }
    public get packType(): PACK_TYPE {
        return this._packType;
    }
}

export default _DataChangeScene.getInstance();