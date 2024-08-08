import { _decorator, Component, director, Node } from 'cc';
import { LayoutBoard } from './layout_scene_game/LayoutBoard';
import { LayoutLobby } from './layout_scene_game/LayoutLobby';
import { LayoutGame } from './layout_scene_game/LayoutGame';
import { EVENT_TYPE, GAME_LAYOUT } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('SceneGame')
export class SceneGame extends Component {

    @property(LayoutLobby) layoutLobby: LayoutLobby;
    @property(LayoutGame) layoutGame: LayoutGame;
    @property(LayoutBoard) layoutBoard: LayoutBoard;

    start() {
        this.setVisibleLayout({ layout: GAME_LAYOUT.LOBBY });
        director.on(EVENT_TYPE.SWITCH_LAYOUT, this.setVisibleLayout, this);
    }

    test() {

    }

    setVisibleLayout(data: { layout: GAME_LAYOUT, data?: any }) {
        switch (data.layout) {
            case GAME_LAYOUT.LOBBY:
                this.showLayout(this.layoutLobby, data.data);
                break;
            case GAME_LAYOUT.BOARD:
                this.showLayout(this.layoutBoard, data.data);
                break;
            case GAME_LAYOUT.GAME:
                this.showLayout(this.layoutGame, data.data);
                break;
        }
    }

    showLayout(layout: LayoutBoard | LayoutLobby | LayoutGame, data?: any) {
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
        setVisible(this.layoutGame);
    }
}


