import { _decorator, Component, Node, tween, Tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoverButton')
export class HoverButton extends Component {
    start() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseCancel, this);
    }

    onMouseEnter() {
        const node = this.node;
        Tween.stopAllByTarget(node);
        tween(node).to(0.1, { scale: v3(1.1, 1.1, 1.1) }).
            start()
    }

    onMouseCancel() {
        const node = this.node;
        Tween.stopAllByTarget(node);
        tween(node).to(0.1, { scale: v3(1, 1, 1) }).
            start()
    }
}


