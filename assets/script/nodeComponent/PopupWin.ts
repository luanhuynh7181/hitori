import { _decorator, Component, director, Node } from 'cc';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../Enum';
import { Utility } from '../Utility';
import { BackgroundSound } from '../scene/sound/BackgroundSound';
import { Transition } from '../effect/Transition';
const { ccclass, property } = _decorator;

@ccclass('PopupWin')
export class PopupWin extends Component {

    @property(Node) nodePopup: Node = null;

    transition: Transition = new Transition();

    onLoad() {
        this.node.active = false;
        this.transition.addTransition(this.nodePopup, 0, 100);
    }

    show() {
        this.node.active = true;
        BackgroundSound.instance.playSuccess();
        this.transition.runIn();
    }

    onClickNext() {
        this.node.active = false;
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.BOARD, data: PACK_TYPE.CLASSIC });
        return;
        const boardInfo = Utility.getNextBoard();
        if (boardInfo) {
            director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.GAME, data: boardInfo });
            return;
        }
    }

    onClickClose() {
        this.onClickNext();
    }
}


