import { _decorator, Component, director, Node } from 'cc';
import { EVENT_TYPE, GAME_LAYOUT } from '../Enum';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('PopupWin')
export class PopupWin extends Component {

    show() {
        this.node.active = true;
    }

    onClickBack() {
        this.node.active = false;
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.LOBBY });
    }

    onClickNext() {
        this.node.active = false;
        const boardInfo = Utility.getNextBoard();
        if (boardInfo) {
            director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.GAME, data: boardInfo });
            return;
        }
    }

    onClickClose() {
        this.node.active = false;
    }
}


