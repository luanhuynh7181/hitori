import { _decorator, Component, director, Label, Node } from 'cc';
import { SceneGame } from '../scene/SceneGame';
import { EVENT_TYPE, GAME_LAYOUT, PACK_TYPE } from '../Enum';
import { BoardInfo } from '../Type';
const { ccclass, property } = _decorator;

@ccclass('PageviewItem')
export class PageviewItem extends Component {
    @property(Label) label: Label = null;
    private boardInfo: BoardInfo = null;
    start() {

    }

    setup(packType: PACK_TYPE, boardSize: number, boardIndex: number) {
        this.boardInfo = { packType, boardSize, boardIndex };
        this.label.string = `${boardIndex + 1}`;
    }

    isLocked() {
        return false;
    }

    onClick() {
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.GAME, data: this.boardInfo });
    }
}


