import { _decorator, AssetManager, clamp, Component, director, EventTouch, Node, PageView } from 'cc';
import { PACK_TYPE } from '../../Constant';
import { SceneGame } from '../SceneGame';
import { EVENT_TYPE, GAME_LAYOUT } from '../../Enum';

const { ccclass, property } = _decorator;

@ccclass('LayoutBoard')
export class LayoutBoard extends Component {

    @property(PageView) pv: PageView = null;

    changePage(event: EventTouch, change: string) {
        const pages = this.pv.getPages().length;
        const pageIndex: number = parseInt("" + this.pv.getCurrentPageIndex()) + parseInt(change);
        this.updatePage((pageIndex + pages) % pages);
    }

    updatePage(pageIndex: number) {
        this.pv.scrollToPage(pageIndex, 0);
    }

    onShow(packType: PACK_TYPE) {
        this.updatePage(packType);
    }

    onClickBack() {
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.LOBBY });
    }
}


