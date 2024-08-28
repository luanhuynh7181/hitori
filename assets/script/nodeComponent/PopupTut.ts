import { _decorator, Component, Label, math, Node, Sprite, UITransform, Vec3, Widget } from 'cc';
import { Transition } from '../effect/Transition';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('PopupTut')
export class PopupTut extends Component {
    @property(Label) lbNext: Label = null;
    @property(Node) nodePopup: Node = null;
    @property(UITransform) bg1: UITransform = null;
    @property(UITransform) bg2: UITransform = null;
    @property(Node) nodeLabel: Node = null;
    @property(Node) btnNext: Node = null;
    @property(Node) btnPrev: Node = null;
    @property(Sprite) bgNext: Sprite = null;
    @property(Sprite) bgPrev: Sprite = null;
    private halfButton: number = 25;
    private cbNextTut: Function = null;
    private cbExitTut: Function = null;
    transition: Transition = new Transition();
    private step: number = 0;
    private maxStep: number = 4;
    onLoad() {
        this.transition
            .addTransition(this.nodePopup, -30, 0, 0)
        this.nodePopup.setPosition(-1000, 0);
    }

    onShow() {
        this.maxStep = this.nodeLabel.children.length - 1;
    }

    onResize(visibleSize: math.Size) {
        this.node.getComponent(UITransform).setContentSize(visibleSize);
        this.nodePopup.getComponent(Widget).updateAlignment();
        this.transition.updateOrgPos(this.nodePopup);
    }

    updateSizePopup(size: math.Size) {
        size.height += this.halfButton;
        this.bg1.setContentSize(size.width + 10, size.height + 10);
        this.bg2.setContentSize(size);
        const pos = new Vec3(size.width / 2, 0, 0);
        this.bg1.node.setPosition(pos);
        this.bg2.node.setPosition(pos);
        this.nodeLabel.setPosition(pos.x, pos.y + this.halfButton / 2);
        this.updateBtnByStep(pos.x, -size.height / 2);
        this.showLabel();
    }

    updateBtnByStep(x: number, y: number) {
        this.lbNext.string = this.step === this.maxStep ? "Play" : "Next";
        let delta = 60;
        this.btnNext.setPosition(x + delta, y);
        this.btnPrev.setPosition(x - delta, y);
        Utility.updateColorSprite(this.bgPrev, this.step ? "#173438" : "#6B6B6B");

    }

    showLabel() {
        for (let i = 0; i < this.nodeLabel.children.length; i++) {
            this.nodeLabel.children[i].active = i == this.step;
        }
    }

    showFirstRule() {
        this.step = 0;
        this.updateSizePopup(new math.Size(420, 110));
        this.transition.runIn();
    }

    showInvalidCoords() {
        this.updateSizePopup(new math.Size(420, 110));
        this.transition.runIn();
    }

    showInvalidArea() {
        this.updateSizePopup(new math.Size(320, 150));
        this.transition.runIn();
    }

    showMarkedCell() {
        this.updateSizePopup(new math.Size(310, 110));
        this.transition.runIn();
    }

    showFinish() {
        this.updateSizePopup(new math.Size(300, 110));
        this.transition.runIn();
    }

    setCbNextTut(cb: Function) {
        this.cbNextTut = cb;
    }

    setCbExitTut(cb: Function) {
        this.cbExitTut = cb;
    }

    onClickNext() {
        this.cbNextTut(++this.step);
    }

    onClickPrev() {
        if (this.step === 0) return;
        this.cbNextTut(--this.step);
    }

    onClickSkip() {
        this.cbExitTut();
    }




}


