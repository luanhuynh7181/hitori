import { _decorator, Component, Node } from 'cc';
import { PageviewBoard } from '../board_view/PageviewBoard';
const { ccclass, property } = _decorator;

@ccclass('SceneBoardGame')
export class SceneBoardGame extends Component {
    @property(Node) pvClassic: Node = null;
    start() {
        const pvClassic: PageviewBoard = this.pvClassic.getComponent(PageviewBoard);
    }

    update(deltaTime: number) {

    }
}


