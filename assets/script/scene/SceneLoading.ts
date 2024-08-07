import { _decorator, Component, director, JsonAsset, Node, resources } from 'cc';
import { PACK_TYPE } from '../Constant';
import BoardConfig from '../board/BoardConfig';
import PackConfig from '../board/PackConfig';
import DataConfig from '../board/DataConfig';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {
    async start() {
        console.log("sceneLoading")
        await this.loadBoard();
        // await this.preloadSceneAsync('SceneChooseBoard');
        director.loadScene("SceneLobby");
    }

    async loadBoard() {
        const boardData = [
            { name: PACK_TYPE.CLASSIC, "path": "classic" },
            { name: PACK_TYPE.DAILY, "path": "daily" },
            { name: PACK_TYPE.CUSTOM, "path": "custom" },
        ]
        try {
            for (const data of boardData) {
                const jsonAsset = await this.loadDirAsync(data.path);
                const pack: PackConfig = new PackConfig();
                for (const asset of jsonAsset) {
                    const jsonData = await this.loadJsonAsset(data.path, asset.name);
                    const dataJson = jsonData.json;
                    const boardSize = parseInt(asset.name);
                    const boards: BoardConfig[] = [];
                    for (const boardJson of dataJson["boards"]) {
                        const board: BoardConfig = new BoardConfig(boardJson["board"], boardJson["solution"]);
                        boards.push(board);
                    }
                    pack.addBoardConfig(boardSize, boards);
                }
                DataConfig.addPackConfig(data.name, pack);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    loadDirAsync(dir: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            resources.loadDir("board/" + dir, (err, assets) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(assets);
                }
            });
        });
    }

    loadJsonAsset(folder: string, name: string): Promise<JsonAsset> {
        return new Promise((resolve, reject) => {
            resources.load('board/' + folder + "/" + name, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(jsonAsset);
                }
            });
        });
    }

    preloadSceneAsync(sceneName: string) {
        return new Promise<void>((resolve, reject) => {
            director.preloadScene(sceneName, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}


