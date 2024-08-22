import { _decorator, Component, director, Node } from 'cc';
import { LayoutBoard } from './layout_scene_game/LayoutBoard';
import { LayoutLobby } from './layout_scene_game/LayoutLobby';
import { LayoutGame } from './layout_scene_game/LayoutGame';
import { EVENT_TYPE, GAME_LAYOUT } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('SceneGame')
export class SceneGame extends Component {
    @property(Node) background: Node;
    @property(LayoutLobby) layoutLobby: LayoutLobby;
    @property(LayoutGame) layoutGame: LayoutGame;
    @property(LayoutBoard) layoutBoard: LayoutBoard;

    start() {
        this.loadLayout();

        director.on(EVENT_TYPE.SWITCH_LAYOUT, this.setVisibleLayout, this);
        this.setVisibleLayout({ layout: GAME_LAYOUT.LOBBY });
    }

    loadLayout() {
        this.layoutLobby.node.active = true;
        this.layoutGame.node.active = true;
        this.layoutBoard.node.active = true;
    }

    setVisibleLayout(data: { layout: GAME_LAYOUT, data?: any }) {
        this.background.setSiblingIndex(10);
        switch (data.layout) {
            case GAME_LAYOUT.LOBBY:
                this.layoutLobby.node.setSiblingIndex(10);
                this.layoutLobby.onShow(data.data);
                break;
            case GAME_LAYOUT.BOARD:
                this.layoutBoard.node.setSiblingIndex(10);
                this.layoutBoard.onShow(data.data);
                break;
            case GAME_LAYOUT.GAME:
                this.layoutGame.node.setSiblingIndex(10);
                this.layoutGame.onShow(data.data);
                break;
        }
    }
}


