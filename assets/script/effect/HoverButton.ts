import { _decorator, Component, Node, tween, Tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoverButton')
export class HoverButton extends Component {
    private scaleTo: number = 1.1;
    private scaleTime: number = 0.07;
    start() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseCancel, this);
    }

    onMouseEnter() {
        const node = this.node;
        Tween.stopAllByTag(1, node);
        tween(node).to(this.scaleTime, { scale: v3(this.scaleTo, this.scaleTo, this.scaleTo) }).
            tag(1).
            start()
    }

    onMouseCancel() {
        const node = this.node;
        Tween.stopAllByTag(1, node);
        tween(node).to(this.scaleTime, { scale: v3(1, 1, 1) }).
            tag(1).
            start()
    }
}


