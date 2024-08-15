import { _decorator, assetManager, Component, director, EventTouch, Node } from 'cc';
import { SceneGame } from '../SceneGame';
import { LayoutBoard } from './LayoutBoard';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../../Enum';
import { Transition } from '../../effect/Transition';
const { ccclass, property } = _decorator;

@ccclass('LayoutLobby')
export class LayoutLobby extends Component {

    @property(Node) lbGameName: Node = null;
    @property(Node) btnPlayNow: Node = null;
    @property(Node) btnContinue: Node = null;
    @property(Node) btnSelectBoard: Node = null;
    @property(Node) lbVer: Node = null;
    private transition: Transition = new Transition();

    onLoad() {
        this.transition.addTransition(this.lbGameName, 0, 150);
        this.transition.addTransition(this.btnPlayNow, 0, 50, 0.2);
        this.transition.addTransition(this.btnSelectBoard, 0, 50, 0.1);
        this.transition.addTransition(this.btnContinue, 0, 50);
        this.transition.addTransition(this.lbVer, 0, -200);
    }

    onClickBoard(event: EventTouch, packType: string) {

    }

    onClickPlayNow(event: EventTouch) {
    }

    onClickSelectBoard(event: EventTouch) {
        // const scene: SceneGame = director.getScene().getChildByName("SceneGame").getComponent(SceneGame);
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.BOARD, data: PACK_TYPE.CLASSIC });
    }

    onClickContinue(event: EventTouch) {
    }

    onShow(data: any) {
        this.node.active = true;
        this.transition.runIn();
    }
}


