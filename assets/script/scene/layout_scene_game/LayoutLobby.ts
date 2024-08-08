import { _decorator, assetManager, Component, director, EventTouch, Node } from 'cc';
import { SceneGame } from '../SceneGame';
const { ccclass, property } = _decorator;

@ccclass('LayoutLobby')
export class LayoutLobby extends Component {

    onClickBoard(event: EventTouch, packType: string) {
        // this.scene.setVisibleBoard(packType);
    }

    onShow(data: any) {

    }
}


