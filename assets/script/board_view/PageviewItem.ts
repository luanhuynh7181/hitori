import { _decorator, Component, director, Label, Node } from 'cc';
import { PACK_TYPE } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('PageviewItem')
export class PageviewItem extends Component {
    @property(Label) label: Label = null;
    private packType: PACK_TYPE = null;
    private boardSize: number = null;
    private boardIndex: number = null;
    start() {

    }

    setup(packType: PACK_TYPE, boardSize: number, boardIndex: number) {
        this.packType = packType;
        this.boardSize = boardSize;
        this.boardIndex = boardIndex;
        this.label.string = `${boardIndex + 1}`;
    }

    isLocked() {
        return false;
    }

    onClick() {

    }
}


