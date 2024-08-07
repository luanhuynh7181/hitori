import { PACK_TYPE } from "../Constant";
import BoardGame from "./BoardGame";


class PackGame {
    public static _instance: PackGame = new PackGame();
    public get instance(): PackGame {
        return PackGame._instance;
    }

    private boardData: Map<PACK_TYPE, BoardGame> = new Map();
}

export default PackGame;
