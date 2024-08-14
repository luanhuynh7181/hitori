import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeTimer')
export class NodeTimer extends Component {
    @property(Label) lbTime: Label = null;
    private time: number = 0;
    private key: NodeJS.Timeout = null
    start() {

    }

    onEnable() {
        this.time = -1;
        clearInterval(this.key);
        console.log('onEnable');
        this.key = setInterval(() => {
            this.time++;
            const minutes = Math.floor(this.time / 60);
            const seconds = this.time % 60;
            this.lbTime.string = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }, 1000);
    }

}


