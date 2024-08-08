import { _decorator, AssetManager, clamp, Component, director, EventTouch, Node, PageView } from 'cc';
import { PACK_TYPE } from '../../Constant';
import { SceneGame } from '../SceneGame';

const { ccclass, property } = _decorator;

@ccclass('LayoutBoard')
export class LayoutBoard extends Component {

    @property(SceneGame) sceneGame: SceneGame;
    @property(PageView) pv: PageView = null;

    changePage(event: EventTouch, change: string) {
        const pageIndex = this.pv.getCurrentPageIndex() + parseInt(change);
        this.updatePage(clamp(pageIndex, 0, this.pv.getPages().length - 1));
    }

    updatePage(pageIndex: number) {
        this.pv.setCurrentPageIndex(pageIndex);
    }

    onShow(packType: PACK_TYPE) {
        this.updatePage(packType);
    }

    onClickBack() {
        // this.sceneGame.setVisibleLobby();
    }
}


