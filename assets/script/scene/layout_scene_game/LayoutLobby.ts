import { _decorator, assetManager, Component, director, EventTouch, Label, math, Node, view } from 'cc';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../../Enum';
import { Transition } from '../../effect/Transition';
import { Utility } from '../../Utility';
const { ccclass, property } = _decorator;

@ccclass('LayoutLobby')
export class LayoutLobby extends Component {

    @property(Node) lbGameName: Node = null;
    @property(Node) btnPlayNow: Node = null;
    @property(Node) btnSelectBoard: Node = null;
    @property(Node) lbVer: Node = null;
    @property(Label) lbBoardFinish: Label = null;
    private transition: Transition = new Transition();

    onLoad() {
        this.transition.addTransition(this.lbGameName, 0, 150);
        this.transition.addTransition(this.btnPlayNow, 0, 50, 0.2);
        this.transition.addTransition(this.btnSelectBoard, 0, 50, 0.1);
        this.transition.addTransition(this.lbVer, 0, -200);
    }

    onResize(designeResolution: math.Size, visibleSize: math.Size) {
    }

    onClickPlayNow(event: EventTouch) {
        const boardInfo = Utility.getNextBoard();
        if (boardInfo) {
            director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.GAME, data: boardInfo });
            return;
        }
        console.log("All board finished");
    }

    onClickSelectBoard(event: EventTouch) {
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.BOARD, data: PACK_TYPE.CLASSIC });
    }

    onShow(data: any) {
        const { total, finished } = Utility.getBoardFinishInfo();
        this.lbBoardFinish.string = `${finished}/${total}`;
        setTimeout(() => {
            this.transition.runIn();
        }, 0);
    }
}


