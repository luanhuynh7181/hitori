import { _decorator, AssetManager, clamp, Component, director, EventTouch, Node, PageView } from 'cc';
import { SceneGame } from '../SceneGame';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../../Enum';

const { ccclass, property } = _decorator;

@ccclass('LayoutBoard')
export class LayoutBoard extends Component {
    @property(Node) packView: Node = null;
    start() {
        this.node
    }
    onShow(packType: PACK_TYPE) {

    }

    onClickBack() {
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.LOBBY });
    }
}


