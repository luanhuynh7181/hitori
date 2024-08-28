import { _decorator, Component, Node, tween, Tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoverButton')
export class HoverButton extends Component {
    private scaleTo: number = 1.1;
    private scaleTime: number = 0.07;
    private scaleOrg: number = 1;
    start() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseCancel, this);
        this.scaleOrg = this.node.scale.x;
        this.scaleTo = this.scaleOrg * 1.15;
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
        tween(node).to(this.scaleTime, { scale: v3(this.scaleOrg, this.scaleOrg, this.scaleOrg) }).
            tag(1).
            start()
    }
}


