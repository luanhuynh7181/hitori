import { _decorator, AssetManager, clamp, Component, director, EventTouch, math, Node, PageView, UITransform, Widget } from 'cc';
import { SceneGame } from '../SceneGame';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../../Enum';
import { Transition } from '../../effect/Transition';
import { PageviewPack } from '../../board_view/PageviewPack';

const { ccclass, property } = _decorator;

@ccclass('LayoutBoard')
export class LayoutBoard extends Component {
    @property(Node) packView: Node;
    @property(Node) btnBack: Node;
    private transition: Transition = new Transition();

    onLoad() {
        this.transition
            .addTransition(this.btnBack, -100)
            .addTransition(this.packView, 100);
        director.on(EVENT_TYPE.ONCLICK_ITEM_BOARD, this.onClickItemBoard, this);
    }

    onResize(designeResolution: math.Size, visibleSize: math.Size) {
        console.log("onResize", visibleSize, designeResolution);
        this.node.getComponent(UITransform).setContentSize(visibleSize);
        this.btnBack.getComponent(Widget).updateAlignment();
        this.transition.updateOrgPos(this.btnBack);
    }


    onShow(packType: PACK_TYPE) {
        this.transition.runIn();
        this.packView.getComponent(PageviewPack).onShow(packType);
    }

    onClickItemBoard(data: { layout: GAME_LAYOUT, data: any }) {
        this.transition.runOut(() => {
            director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.GAME, data: data.data });
        });
    }

    onClickBack() {
        this.transition.runOut(() => {
            director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.LOBBY })
        });
    }
}


