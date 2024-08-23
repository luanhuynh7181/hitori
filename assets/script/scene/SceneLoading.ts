import { _decorator, assetManager, Component, director, JsonAsset, Node, resources } from 'cc';
import BoardConfig from '../board/BoardConfig';
import PackConfig from '../board/PackConfig';
import DataConfig from '../board/DataConfig';
import { PACK_TYPE } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {

    @property(Node) nodeLoading: Node;

    async start() {
        this.setLoadingProgress(2);
        await this.loadSceneGame();
        this.setLoadingProgress(3);
        await this.loadConfig();
        director.loadScene("SceneGame");

    };

    async loadConfig() {
        const boardData = [
            { name: PACK_TYPE.CLASSIC, "path": "classic" },
            { name: PACK_TYPE.DAILY, "path": "daily" },
            { name: PACK_TYPE.CUSTOM, "path": "custom" },
        ]
        try {
            let loadingProgress = 3;
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
                this.setLoadingProgress(++loadingProgress);
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

    async loadSceneGame() {
        await new Promise<void>((resolve) => {
            director.preloadScene("SceneGame", function () {
                resolve(); // Resolve the promise when the scene is preloaded
            });
        });
    }

    setLoadingProgress(number: number) {
        const children = this.nodeLoading.children;
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (i < number) {
                node.active = true;
            } else {
                node.active = false;
            }
        }
    }
}


