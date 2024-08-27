import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeTimer')
export class NodeTimer extends Component {
    @property(Label) lbTime: Label = null;
    private time: number = 0;
    start() {

    }

    onShow() {
        this.time = -1;
        this.updateTime();
        this.unschedule(this.updateTime);
        this.schedule(this.updateTime, 1);
    }

    updateTime() {
        this.time++;
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        this.lbTime.string = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

}


