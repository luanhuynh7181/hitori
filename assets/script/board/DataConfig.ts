import { PACK_TYPE } from "../Constant";
import PackConfig from "./PackConfig";


class _DataConfig {
    public static _instance: _DataConfig = new _DataConfig();
    public get instance(): _DataConfig {
        return _DataConfig._instance;
    }
    private boardData: Map<PACK_TYPE, PackConfig> = new Map();

    public addPackConfig(packType: PACK_TYPE, packConfig: PackConfig) {
        this.boardData.set(packType, packConfig);
    }

    public getPackConfig(packType: PACK_TYPE): PackConfig {
        return this.boardData.get(packType);
    }
}

const DataConfig = _DataConfig._instance;
export default DataConfig;
