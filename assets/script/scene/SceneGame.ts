import { _decorator, Component, Node } from 'cc';
import { LayoutBoard } from './layout_scene_game/LayoutBoard';
import { LayoutLobby } from './layout_scene_game/LayoutLobby';
import { LayoutGame } from './layout_scene_game/LayoutGame';
const { ccclass, property } = _decorator;

@ccclass('SceneGame')
export class SceneGame extends Component {

    @property(LayoutLobby) layoutLobby: LayoutLobby;
    @property(LayoutGame) layoutGame: LayoutGame;
    @property(LayoutBoard) layoutBoard: LayoutBoard;

    start() {
        console.log("SceneGame start");
        this.setVisibleLobby()
    }

    setVisibleLobby(data?: any) {
        this.setVisibleLayout(this.layoutLobby);
    }

    setVisibleBoard(data?: any) {
        this.setVisibleLayout(this.layoutBoard);
    }

    setVisibleGame(data?: any) {
        this.setVisibleLayout(this.layoutGame);
    }

    setVisibleLayout(layout: LayoutBoard | LayoutLobby | LayoutGame, data?: any) {
        function setVisible(_layout: LayoutBoard | LayoutLobby | LayoutGame) {
            if (_layout === layout) {
                _layout.onShow(data);
                _layout.node.active = true;
            } else {
                _layout.node.active = false;
            }
        }
        setVisible(this.layoutBoard);
        setVisible(this.layoutLobby);
    }
}


