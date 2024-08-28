import { _decorator, Component, Label, math, Node, UITransform, Widget } from 'cc';
import { Transition } from '../effect/Transition';
const { ccclass, property } = _decorator;

@ccclass('PopupTut')
export class PopupTut extends Component {
    @property(Label) lbTut: Label = null;
    @property(Node) nodePopup: Node = null;
    private cbNextTut: Function = null;
    private cbExitTut: Function = null;
    transition: Transition = new Transition();
    start() {
        this.transition
            .addTransition(this.nodePopup, -200, 0)
    }

    onShow() {
        this.scheduleOnce(() => {
            this.transition.runIn();
        });
    }

    onResize(visibleSize: math.Size) {
        // this.node.getComponent(UITransform).setContentSize(visibleSize);
        // this.nodePopup.getComponent(Widget).updateAlignment();
        // this.transition.updateOrgPos(this.nodePopup);
    }

    showFirstRule() {
        this.lbTut.string = "The rules of Hitori are simple\n- No number should appear unshaded more than once in a row or a column";
    }

    showInvalidCoords() {
        this.lbTut.string = "2 black cells cannot be adjacent horizontally or vertically";
    }

    showInvalidArea() {
        this.lbTut.string = "All non-shaded cells should be connected in a single group by vertical or horizontal motion";
    }

    showMarkedCell() {
        this.lbTut.string = "You can mark a cell if you think that cell is no need to shade by clicking on right";
    }

    setCbNextTut(cb: Function) {
        this.cbNextTut = cb;
    }

    setCbExitTut(cb: Function) {
        this.cbExitTut = cb;
    }

    onClickNext() {
        this.cbNextTut();
    }

    onClickSkip() {
        this.cbExitTut();
    }

    showFinish() {
        this.lbTut.string = "Congratulation! You have finished the tutorial";
    }


}


