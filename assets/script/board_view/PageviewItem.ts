import { _decorator, Color, Component, director, Label, Node } from 'cc';
import { SceneGame } from '../scene/SceneGame';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../Enum';
import { BoardInfo } from '../Type';
import { LocalStorage } from '../Storage';
import { Utility } from '../Utility';
const { ccclass, property } = _decorator;

@ccclass('PageviewItem')
export class PageviewItem extends Component {
    @property(Label) label: Label = null;
    @property(Node) iconCheck: Node = null;
    @property(Node) nodeFront: Node = null;

    private boardInfo: BoardInfo = null;

    setup(packType: PACK_TYPE, boardSize: number, boardIndex: number) {
        this.boardInfo = { packType, boardSize, boardIndex };
        this.label.string = `${boardIndex + 1}`;
    }

    onShow() {
        let isFinished = LocalStorage.isBoardFinished(this.boardInfo);
        this.iconCheck.active = isFinished;
        this.label.node.active = !isFinished;
        Utility.updateColorNode(this.nodeFront, isFinished ? "#5BC300" : "#173438");
    }

    onClick() {
        director.emit(EVENT_TYPE.ONCLICK_ITEM_BOARD, { layout: GAME_LAYOUT.GAME, data: this.boardInfo });
    }

    public updateColor(color: string) {
        const hex = Color.fromHEX(new Color(), color);
        this.label.color = hex;
    }
}


