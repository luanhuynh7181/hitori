import { TTransitionInfo } from "../Type";
import { Button, color, Label, Node, Tween, tween, UIOpacity, v3 } from 'cc';


export class Transition {
    private transition: TTransitionInfo[] = [];
    constructor() {
    }

    public addTransition(node: Node, deltaX: number = 0, deltaY: number = 0, delay: number = 0, duration: number = 0.3) {
        if (!node.orgPos) node.orgPos = node.getPosition();
        this.transition.push({ node, duration, delay, deltaX, deltaY });
        // check and add component UIOpacity
        if (!node.getComponent(UIOpacity)) {
            node.addComponent(UIOpacity);
        }
        return this;
    }

    public updateOrgPos(node: Node) {
        node.orgPos = node.getPosition();
    }

    public runIn() {
        for (const tran of this.transition) {
            Tween.stopAllByTarget(tran.node);
            tran.node.setPosition(tran.node.orgPos.x + tran.deltaX, tran.node.orgPos.y + tran.deltaY);
            tran.node.getComponent(UIOpacity).opacity = 0;

            tween(tran.node)
                .delay(tran.delay)
                .to(tran.duration, { position: tran.node.orgPos }, { easing: "backInOut" })
                .start();

            tween(tran.node.getComponent(UIOpacity))
                .delay(tran.delay)
                .to(tran.duration, { opacity: 255 })
                .start();

        }
    }

    public runOut(callback?: () => void, timeLoad: number = 0) {
        let timeOut = 0;
        for (const tran of this.transition) {
            timeOut = Math.max(timeOut, tran.duration + tran.delay);
            Tween.stopAllByTarget(tran.node);
            tran.node.setPosition(tran.node.orgPos);
            tran.node.getComponent(UIOpacity).opacity = 255;

            tween(tran.node)
                .to(tran.duration, { position: v3(tran.node.orgPos.x + tran.deltaX, tran.node.orgPos.y + tran.deltaY) },
                    { easing: "backOut" })
                .start();

            tween(tran.node.getComponent(UIOpacity))
                .to(tran.duration, { opacity: 0 })
                .start();
        }
        timeOut = Math.max(0, timeOut - timeLoad);
        setTimeout(() => {
            callback && callback();
        }, timeOut * 1000);
    }
}


