import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageviewBoard')
export class PageviewBoard extends Component {
    @property(Prefab) pvItem: Node = null;
    start() {
    }

    update(deltaTime: number) {

    }
}


