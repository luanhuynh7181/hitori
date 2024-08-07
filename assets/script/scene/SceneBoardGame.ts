import { _decorator, Component, Node, PageView } from 'cc';
import { PageviewBoard } from '../board_view/PageviewBoard';
import DataChangeScene from '../data/DataChangeScene';
const { ccclass, property } = _decorator;

@ccclass('SceneBoardGame')
export class SceneBoardGame extends Component {
    @property(PageView) pv: PageView = null;

    onLoad() {
        console.log("SceneBoardGame onload");
    }
    start() {
        const pageIndex = DataChangeScene.packType;
        this.pv.setCurrentPageIndex(pageIndex);
    }

    onClickNext() {
        const pageCount = this.pv.getPages().length;
        this.pv.scrollToPage((this.pv.getCurrentPageIndex() + 1) % pageCount, 0);
    }

    onClickPrev() {
        const pageCount = this.pv.getPages().length;
        this.pv.scrollToPage((this.pv.getCurrentPageIndex() - 1 + pageCount) % pageCount, 0);
    }
}


