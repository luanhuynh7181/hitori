import { _decorator, assetManager, Component, director, EventTouch, Node } from 'cc';
import { SceneGame } from '../SceneGame';
import { LayoutBoard } from './LayoutBoard';
import { EVENT_TYPE, GAME_LAYOUT } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('LayoutLobby')
export class LayoutLobby extends Component {

    onClickBoard(event: EventTouch, packType: string) {
        const scene: SceneGame = director.getScene().getChildByName("SceneGame").getComponent(SceneGame);
        director.emit(EVENT_TYPE.SWITCH_LAYOUT, { layout: GAME_LAYOUT.BOARD, data: packType });
    }

    onShow(data: any) {

    }
}


