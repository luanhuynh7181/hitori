import { _decorator, assetManager, Component, director, JsonAsset, Node, ResolutionPolicy, resources, view } from 'cc';
import BoardConfig from '../board/BoardConfig';
import PackConfig from '../board/PackConfig';
import DataConfig from '../board/DataConfig';
import { PACK_TYPE } from '../Enum';
import { LocalStorage } from '../Storage';
import CrazySDK from '../../CrazySDK/CrazySDK';
import { GAME_ANALYTICS } from '../../GameAnalytics/GameAnalytics';
import { isModeDev } from '../Constant';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {

    @property(Node) nodeLoading: Node;
    @property(Node) nodeBg: Node;

    onLoad() {
        view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
        window.addEventListener('resize', this.onResize);
    }

    onResize() {
        const scale = Utility.getScaleScreen();
        this.nodeBg?.setScale(scale, scale);
        if (isModeDev) return;
        view.setCanvasSize(window.innerWidth, window.innerHeight);
    }

    async start() {

        this.onResize();
        this.setLoadingProgress(0);
        await CrazySDK.init();
        CrazySDK.game.loadingStart();
        LocalStorage.loadData();
        this.setLoadingProgress(1);
        await this.loadGameAnalytics();
        this.setLoadingProgress(2);
        await this.loadSceneGame();
        this.setLoadingProgress(3);
        await this.loadConfig();
        CrazySDK.game.loadingStop();
        director.loadScene("SceneGame");

    };

    async loadGameAnalytics() {
        const token = await CrazySDK.user.getUserToken();
        const data = JSON.parse(atob(token.split('.')[1]));
        const userId = data.userId;
        GAME_ANALYTICS.init(userId);
    }

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

    onDestroy() {
        window.removeEventListener('resize', this.onResize);
    }

}


