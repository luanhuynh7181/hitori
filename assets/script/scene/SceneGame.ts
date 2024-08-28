import { _decorator, Color, Component, director, Node, Sprite, tween, Tween, UIOpacity, view } from 'cc';
import { LayoutBoard } from './layout_scene_game/LayoutBoard';
import { LayoutLobby } from './layout_scene_game/LayoutLobby';
import { LayoutGame } from './layout_scene_game/LayoutGame';
import { EVENT_TYPE, GAME_LAYOUT } from '../Enum';
import { DESIGN_SIZE } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('SceneGame')
export class SceneGame extends Component {

    @property(LayoutLobby) layoutLobby: LayoutLobby;
    @property(LayoutGame) layoutGame: LayoutGame;
    @property(LayoutBoard) layoutBoard: LayoutBoard;

    @property(Node) background: Node;
    @property(Node) background2: Node;

    start() {
        director.on(EVENT_TYPE.SWITCH_LAYOUT, this.setVisibleLayout, this);

        window.addEventListener('resize', this.onResize.bind(this));

        this.onResize();
        this.setVisibleLayout({ layout: GAME_LAYOUT.LOBBY });
    }

    onResize() {
        const viewSize = view.getVisibleSize();
        const designSize = view.getDesignResolutionSize();
        this.layoutLobby.onResize(designSize, viewSize);
        this.layoutGame.onResize(designSize, viewSize);
        this.layoutBoard.onResize(designSize, viewSize);
    }

    setVisibleLayout(data: { layout: GAME_LAYOUT, data?: any }) {
        switch (data.layout) {
            case GAME_LAYOUT.LOBBY:
                this.setOrderOnTop(this.layoutLobby.node);
                this.layoutLobby.onShow(data.data);
                break;
            case GAME_LAYOUT.BOARD:
                this.setOrderOnTop(this.layoutBoard.node);
                this.layoutBoard.onShow(data.data);
                break;
            case GAME_LAYOUT.GAME:
                this.setOrderOnTop(this.layoutGame.node);
                this.layoutGame.onShow(data.data);
                break;
        }
    }

    setOrderOnTop(node: Node) {
        this.background.setSiblingIndex(1000);
        node.setSiblingIndex(1000);
    }
}

