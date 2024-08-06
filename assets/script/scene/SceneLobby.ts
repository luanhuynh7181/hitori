import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneLobby')
export class SceneLobby extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onClickClassic() {
        director.loadScene('SceneBoardGame');
    }
}


