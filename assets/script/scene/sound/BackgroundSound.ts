import { _decorator, AudioSource, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundSound')
export class BackgroundSound extends Component {
    @property(AudioSource) clickButton: AudioSource = null;
    @property(AudioSource) success: AudioSource = null;
    public static instance: BackgroundSound = null;
    onLoad() {
        BackgroundSound.instance = this;
    }
    start() {
        director.addPersistRootNode(this.node);
    }

    playClickButton() {
        this.clickButton.play();
    }

    playSuccess() {
        this.success.play();
    }

}


