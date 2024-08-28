import { _decorator, Component, Node } from 'cc';
import { BoardInfo } from '../Type';
const { ccclass, property } = _decorator;

@ccclass('NodeInnovation')
export class NodeInnovation extends Component {
    start() {

    }

    onClick() {

    }

    onShow(boardInfo: BoardInfo) {
        this.unschedule(this.runAction);
        this.scheduleOnce(this.runAction, 10 + boardInfo.boardSize * 3);

    }

    runAction() {

    }
}


