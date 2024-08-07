import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { PACK_TYPE } from '../Constant';
import BoardConfig from '../board/BoardConfig';
import { PageviewItem } from './PageviewItem';
const { ccclass, property } = _decorator;

@ccclass('PageviewBoard')
export class PageviewBoard extends Component {
    @property(Prefab) pvItem: Prefab = null;
    @property(Label) label: Label = null;

    private packType: PACK_TYPE = 0;
    private size: number = 0;
    private boards: BoardConfig[] = null;
    start() {
    }

    setup(packType: PACK_TYPE, size: number, boards: BoardConfig[]) {
        this.packType = packType;
        this.size = size;
        this.boards = boards;
        this.setupUI();
        this.addItems();
    }

    private setupUI() {
        this.label.string = `${this.size} X ${this.size}`;
    }

    addItems() {
        const maxRow = 5;
        const height = 180;
        const width = 180;
        for (let i = 0; i < this.boards.length; i++) {
            const node: Node = instantiate(this.pvItem);
            const pvItem = node.getComponent(PageviewItem);
            pvItem.setup(this.packType, this.size, i);
            node.setPosition(((i % maxRow) - (maxRow - 1) / 2) * width, -Math.floor(i / maxRow) * height);
            this.node.addChild(node);
        }
    }
}


