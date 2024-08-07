import { _decorator, Component, JsonAsset, Node, resources } from 'cc';
import { PACK_TYPE } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {
    start() {
        console.log("sceneLoading")
        this.loadBoard();
    }

    async loadBoard() {
        const boardData = [
            { name: PACK_TYPE.CLASSIC, "path": "classic" },
            { name: PACK_TYPE.DAILY, "path": "daily" },
            { name: PACK_TYPE.DAILY, "path": "special" },
        ]
        try {
            for (const data of boardData) {
                const jsonAsset = await this.loadDirAsync(data.path);
                console.log(jsonAsset)
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

    loadJsonAsset(name: string): Promise<JsonAsset> {
        return new Promise((resolve, reject) => {
            resources.load('board/' + name, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(jsonAsset);
                }
            });
        });
    }

    update(deltaTime: number) {

    }
}


