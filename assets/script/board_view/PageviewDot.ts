import { _decorator, Component, Node } from 'cc';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('PageviewDot')
export class PageviewDot extends Component {
    private isFinished: boolean = false;
    setup(isFinished: boolean) {
        this.isFinished = isFinished;
        if (isFinished) {
            Utility.updateColorSprite(this.node, "#5BC300");
        }
    }

    updateColor(isSelected: boolean) {
        if (this.isFinished) return;
        Utility.updateColorSprite(this.node, isSelected ? "#173438" : "#A3B4A0");
    }
}


