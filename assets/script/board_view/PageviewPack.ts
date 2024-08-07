import { _decorator, Button, CCInteger, Color, Component, EventHandler, ImageAsset, instantiate, Label, Layout, Node, PageView, Prefab, Sprite, SpriteFrame, Texture2D, UITransform } from 'cc';
import { PACK_TYPE } from '../Constant';
import DataConfig from '../board/DataConfig';
import PackConfig from '../board/PackConfig';
import { PageviewBoard } from './PageviewBoard';
import BoardConfig from '../board/BoardConfig';
const { ccclass, property } = _decorator;

@ccclass('PageviewPack')
export class PageviewPack extends Component {
    @property(Node) nodeContent: Node = null;
    @property(Prefab) pvBoard: Prefab = null;
    @property(CCInteger) packType: PACK_TYPE = 0;
    @property(Label) packName: Label = null;
    @property(Node) curPage: Node = null;
    @property(Prefab) pageDot: Prefab = null;
    @property(Node) btnNext: Node = null;
    @property(Node) btnPrev: Node = null;
    private dot: Node[] = [];
    start() {

        this.packName.string = PACK_TYPE[this.packType];
        const packConfig: PackConfig = DataConfig.getPackConfig(this.packType);
        const allBoardSize = packConfig.getBoardConfigSortedBySize();
        this.nodeContent.getComponent(Layout).updateLayout();
        const pv: PageView = this.node.getComponent(PageView);

        for (const { size, boardConfig } of allBoardSize) {
            const node: Node = instantiate(this.pvBoard);
            const pvBoard = node.getComponent(PageviewBoard);
            pvBoard.setup(this.packType, size, boardConfig);
            pv.addPage(node);
        }
        this.createDot();
    }
    createDot() {
        const pv: PageView = this.node.getComponent(PageView);
        const pageCount = pv.getPages().length;
        const width = 80;
        const y = 260;

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
        this.btnPrev.setPosition((-2 - (pageCount - 1) / 2) * width, y);
        this.btnNext.setPosition((pageCount + 1 - (pageCount - 1) / 2) * width, y);
        this.curPage.setSiblingIndex(1000);
        this.onChangePage(0, 0);
    }

    _onChangePage(event: Event, customEventData: string) {
        this.onChangePage(parseInt(customEventData));
    }

    onChangePage(pageIndex: number, time: number = 0.5) {
        const pv: PageView = this.node.getComponent(PageView);
        pv.scrollToPage(pageIndex, time);
        this.curPage.setPosition(this.dot[pageIndex].getPosition());
        this.btnNext.active = pageIndex < this.dot.length - 1;
        this.btnPrev.active = pageIndex > 0;
    }

    onClickNext() {
        const pv: PageView = this.node.getComponent(PageView);
        this.onChangePage(pv.getCurrentPageIndex() + 1);
    }

    onClickPrev() {
        const pv: PageView = this.node.getComponent(PageView);
        this.onChangePage(pv.getCurrentPageIndex() - 1);
    }
}


