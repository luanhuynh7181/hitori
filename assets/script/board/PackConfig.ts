import { PACK_TYPE } from "../Constant";
import BoardConfig from "./BoardConfig";


export default class PackConfig {
    private boardConfig: Map<number, BoardConfig[]> = new Map();

    addBoardConfig(boardSize: number, boardConfig: BoardConfig[]) {
        this.boardConfig.set(boardSize, boardConfig);
    }
}
