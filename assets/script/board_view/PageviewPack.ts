import { _decorator, Button, CCInteger, Color, Component, EventHandler, ImageAsset, instantiate, Label, Layout, Node, PageView, Prefab, Sprite, SpriteFrame, Texture2D, Tween, tween, UITransform } from 'cc';
import DataConfig from '../board/DataConfig';
import PackConfig from '../board/PackConfig';
import { PageviewBoard } from './PageviewBoard';
import BoardConfig from '../board/BoardConfig';
import { PACK_TYPE } from '../Enum';
import { PageviewDot } from './PageviewDot';
import { Utility } from '../Utility';
import { LocalStorage } from '../Storage';
const { ccclass, property } = _decorator;

@ccclass('PageviewPack')
export class PageviewPack extends Component {
    @property(Node) nodeContent: Node = null;
    @property(Prefab) pvBoard: Prefab = null;
    @property(CCInteger) packType: PACK_TYPE = 0;
    @property(Node) curPage: Node = null;
    @property(Prefab) pageDot: Prefab = null;
    @property(Node) btnNext: Node = null;
    @property(Node) btnPrev: Node = null;
    private dot: Node[] = [];
    private pages: PageviewBoard[] = [];
    onLoad() {
        const packConfig: PackConfig = DataConfig.getPackConfig(this.packType);
        const allBoardSize = packConfig.getBoardConfigSortedBySize();
        this.nodeContent.getComponent(Layout).updateLayout();
        const pv: PageView = this.node.getComponent(PageView);

        for (const { size, boardConfig } of allBoardSize) {
            const node: Node = instantiate(this.pvBoard);
            const pvBoard = node.getComponent(PageviewBoard);
            this.pages.push(pvBoard);
            pvBoard.setup(this.packType, size, boardConfig);
            pv.addPage(node);
        }
        pv.node.on(PageView.EventType.SCROLL_ENDED, this.onScrollEnded, this);
        this.createDot();
    }

    onShow(data: any) {
        for (let i = 0; i < this.pages.length; i++) {
            const dot = this.dot[i];
            const page = this.pages[i];
            page.onShow();
            dot.getComponent(PageviewDot).setup(LocalStorage.isFinishAllBoardSize(page.size));
        }
    }

    createDot() {
        const pv: PageView = this.node.getComponent(PageView);
        const pageCount = pv.getPages().length;
        const width = 55;
        const y = this.btnNext.getPosition().y;

        for (let i = 0; i < pageCount; i++) {
            const dotNode: Node = instantiate(this.pageDot);
            this.node.addChild(dotNode);
            dotNode.setPosition((i - (pageCount - 1) / 2) * width, y);
            const button = dotNode.getComponent(Button);
            const eventHandler = new EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = 'PageviewPack';
            eventHandler.handler = '_onChangePage';
            eventHandler.customEventData = i.toString();
            button.clickEvents.push(eventHandler);
            this.dot.push(dotNode);
        }
        this.btnPrev.setPosition((-1.5 - (pageCount - 1) / 2) * width, y);
        this.btnNext.setPosition((pageCount + 0.5 - (pageCount - 1) / 2) * width, y);
        this.curPage.setSiblingIndex(1000);
        this.onChangePage(0, 0);
    }

    _onChangePage(event: Event, customEventData: string) {
        this.onChangePage(parseInt(customEventData));
    }

    updateCurPage(pageIndex: number, time: number = 0.1) {
        for (let i = 0; i < this.dot.length; i++) {
            const dot = this.dot[i];
            dot.getComponent(PageviewDot).updateColor(i === pageIndex);
        }
        const pos = this.dot[pageIndex].getPosition();
        Tween.stopAllByTarget(this.curPage);
        tween(this.curPage)
            .to(time, { position: pos })
            .start();
    }

    onChangePage(pageIndex: number, time: number = 0.5) {
        const pv: PageView = this.node.getComponent(PageView);
        const pageCount = pv.getPages().length;
        pageIndex = (pageIndex + pageCount) % pageCount;
        pv.scrollToPage(pageIndex, time);
        this.updateCurPage(pageIndex);

    }

    onClickNext() {
        const pv: PageView = this.node.getComponent(PageView);
        this.onChangePage(pv.getCurrentPageIndex() + 1);
    }

    onClickPrev() {
        const pv: PageView = this.node.getComponent(PageView);
        this.onChangePage(pv.getCurrentPageIndex() - 1);
    }

    onScrollEnded() {
        const pv: PageView = this.node.getComponent(PageView);
        this.updateCurPage(pv.getCurrentPageIndex(), 0.05);
    }
}


