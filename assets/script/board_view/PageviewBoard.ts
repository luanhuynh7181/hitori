import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import BoardConfig from '../board/BoardConfig';
import { PageviewItem } from './PageviewItem';
import { PACK_TYPE } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('PageviewBoard')
export class PageviewBoard extends Component {
    @property(Prefab) pvItem: Prefab = null;
    @property(Label) label: Label = null;

    private packType: PACK_TYPE = 0;
    public size: number = 0;
    private boards: BoardConfig[] = null;
    private pvItems: PageviewItem[] = [];

    setup(packType: PACK_TYPE, size: number, boards: BoardConfig[]) {
        this.packType = packType;
        this.size = size;
        this.boards = boards;
        this.setupUI();
        this.addItems();
    }

    onShow() {
        for (const pvItem of this.pvItems) {
            pvItem.onShow();
        }
    }

    private setupUI() {
        this.label.string = `${this.size}x${this.size}`;
    }

    addItems() {
        const maxRow = 5;
        const width = 140;
        const yStart = 20;
        for (let i = 0; i < this.boards.length; i++) {
            const node: Node = instantiate(this.pvItem);
            const pvItem = node.getComponent(PageviewItem);
            this.pvItems.push(pvItem);
            pvItem.setup(this.packType, this.size, i);
            node.setPosition(((i % maxRow) - (maxRow - 1) / 2) * width, yStart - Math.floor(i / maxRow) * width);
            this.node.addChild(node);
        }
    }
}


