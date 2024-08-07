import { _decorator, Component, director, EventTouch, Node } from 'cc';
import DataChangeScene from '../data/DataChangeScene';
const { ccclass, property } = _decorator;

@ccclass('SceneLobby')
export class SceneLobby extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    onClickBoard(event: EventTouch, packType: string) {
        console.log("SceneLobby onClickBoard", packType);
        DataChangeScene.packType = parseInt(packType);
        director.loadScene('SceneBoardGame');
    }
}


