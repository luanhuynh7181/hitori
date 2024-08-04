import { _decorator, Component, instantiate, Label, Node, Prefab, UITransform, Vec2 } from 'cc';
import { DataCell } from '../data/DataCell';

const { ccclass, property } = _decorator;

@ccclass('UICell')
export class UICell extends Component {
    @property(Node) imgBg: Node = null;
    @property(Label) lbNumber: Label = null;
    private _dataCell: DataCell = null;

    public set dataCell(dataCell: DataCell) {
        this._dataCell = dataCell;
        this.lbNumber.string = dataCell.value.toString();
    }

    updateSize(size: number) {
        this.imgBg.getComponent(UITransform).width = size;
        this.imgBg.getComponent(UITransform).height = size;
        this.lbNumber.fontSize = size * 0.7;
    }

}


