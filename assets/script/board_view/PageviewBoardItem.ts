import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageViewItem')
export class PageViewItem extends Component {

    @property(Label) label: Label = null;
    start() {

    }

    update(deltaTime: number) {

    }
}


