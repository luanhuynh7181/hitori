import { _decorator, Component, director, Label, Node } from 'cc';
import { Transition } from '../effect/Transition';
import CrazySDK from '../../CrazySDK/CrazySDK';
import { EVENT_TYPE } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('PopupAds')
export class PopupAds extends Component {

    @property(Node) nodePopup: Node = null;
    @property(Label) content: Label = null;

    transition: Transition = new Transition();

    onLoad() {
        this.node.active = false;
        this.transition.addTransition(this.nodePopup, 0, 100);
    }

    show() {
        this.node.active = true;
        this.transition.runIn();
        this.content.string = `Need a little help?\nI'll give you a hint to solve\nthis puzzle!`
    }

    async onClickNext() {
        const hasBlock = await CrazySDK.ad.hasAdblock();
        if (hasBlock) {
            this.content.string = "Please turn off Adblock";
            return;
        }

        CrazySDK.ad.requestAd('rewarded', {
            adError: (error) => {
                console.log('Rewarded video error', error);
            },
            adStarted: () => {
                console.log('Rewarded video started');
            },
            adFinished: () => {
                console.log('Rewarded video finished');
                this.onAdFinish();
            }
        });
    }

    onAdFinish() {
        this.node.active = false;
        director.emit(EVENT_TYPE.FINISH_WATCH_ADS);
    }

    onClickClose() {
        this.node.active = false;
    }
}


