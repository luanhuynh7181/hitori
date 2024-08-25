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
        this.loadLayout();
        director.on(EVENT_TYPE.SWITCH_LAYOUT, this.setVisibleLayout, this);

        window.addEventListener('resize', this.onResize.bind(this));
        if (view.getVisibleSize().width != DESIGN_SIZE.WIDTH) { // fix height
            this.onResize();
        }

        this.setVisibleLayout({ layout: GAME_LAYOUT.LOBBY });
    }

    onResize() {
        const viewSize = view.getVisibleSize();
        const designSize = view.getDesignResolutionSize();
        this.layoutLobby.onResize(designSize, viewSize);
        this.layoutGame.onResize(designSize, viewSize);
        this.layoutBoard.onResize(designSize, viewSize);
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
                this.updateBackground(false);
                break;
            case GAME_LAYOUT.BOARD:
                this.layoutBoard.node.setSiblingIndex(10);
                this.layoutBoard.onShow(data.data);
                this.updateBackground(false);
                break;
            case GAME_LAYOUT.GAME:
                this.layoutGame.node.setSiblingIndex(10);
                this.layoutGame.onShow(data.data);
                this.updateBackground(true);
                break;
        }
    }


    updateBackground(isForGame: boolean) {
        Tween.stopAllByTarget(this.background2);
        tween(this.background2.getComponent(UIOpacity))
            .to(0.2, { opacity: isForGame ? 0 : 100 })
            .start();

        Tween.stopAllByTarget(this.background);
        tween(this.background.getComponent(UIOpacity))
            .to(0.1, { opacity: 100 })
            .call(() => {
                this.background.getComponent(Sprite).color = Color.fromHEX(new Color(), isForGame ? "#CCD4D6" : "#FFFFFF")
            })
            .to(0.1, { opacity: 255 })
            .start();

    }
}

