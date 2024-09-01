import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeTimer')
export class NodeTimer extends Component {
    @property(Label) lbTime: Label = null;
    private time: number = 0;
    start() {

    }

    onShow() {
        this.time = 0;
        this.updateTime();
        this.unschedule(this.updateTime);
        this.scheduleOnce(() => {
            this.schedule(this.updateTime, 1);
        }, 2);
    }

    updateTime() {
        this.time++;
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        this.lbTime.string = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    stop() {
        this.unschedule(this.updateTime);
    }

    resume() {
        this.schedule(this.updateTime, 1);
    }

    getTime() {
        return this.time;
    }

}


