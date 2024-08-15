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

    setVisibleLayout(data: { layout: GAME_LAYOUT, data?: any }) {
        this.layoutLobby.node.active = false;
        this.layoutBoard.node.active = false;
        this.layoutGame.node.active = false;
        switch (data.layout) {
            case GAME_LAYOUT.LOBBY:
                this.layoutLobby.onShow(data.data);
                break;
            case GAME_LAYOUT.BOARD:
                this.layoutBoard.onShow(data.data);
                break;
            case GAME_LAYOUT.GAME:
                this.layoutGame.onShow(data.data);
                break;
        }
    }
}


