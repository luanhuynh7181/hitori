import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab, UITransform, Vec2 } from 'cc';
import { DataCell } from '../../data/DataCell';
import { UICellActionManager } from './UICellActionManager';
import { Tcoords } from '../../type';
import { UICellFlag, UICellInvalidArea, UICellInvalidCoord, UICellShaded, UICellUnshade } from './UICellType';
import { CELL_TYPE } from '../../Enum';
import { Signal } from '../../design/Observer';

const { ccclass, property } = _decorator;

@ccclass('UICell')
export class UICell extends Component {

    @property(Node) imgBg: Node = null;
    @property(Label) lbNumber: Label = null;

    private _dataCell: DataCell = null;
    private uiCellAction: UICellActionManager = null;
    private _coords: Tcoords = null;
    private type: CELL_TYPE = null;
    private _signalChangeType: Signal<UICell> = new Signal<UICell>();
    start() {
        this.uiCellAction = new UICellActionManager(this);
        this.uiCellAction.doAction(UICellUnshade);
        this.type = CELL_TYPE.NONE_SHADE;
        this.imgBg.on(Node.EventType.TOUCH_START, this.onTouchBegin, this);
    }

    public set coords(x: Tcoords) {
        this._coords = x;
    }

    public get coords(): Tcoords {
        return this._coords;
    }

    public set dataCell(dataCell: DataCell) {
        this._dataCell = dataCell;
        this.lbNumber.string = dataCell.value.toString();
    }

    public get signalChangeType(): Signal<UICell> {
        return this._signalChangeType;
    }

    updateSize(size: number) {
        this.imgBg.getComponent(UITransform).width = size;
        this.imgBg.getComponent(UITransform).height = size;
        this.lbNumber.fontSize = size * 0.7;
    }

    onTouchBegin(event: EventTouch) {
        switch (this.type) {
            case CELL_TYPE.NONE_SHADE:
                this.uiCellAction.doAction(UICellShaded);
                this.type = CELL_TYPE.SHADED;
                break;
            case CELL_TYPE.SHADED:
                this.uiCellAction.doAction(UICellFlag);
                this.type = CELL_TYPE.FLAG;
                break;
            case CELL_TYPE.FLAG:
                this.uiCellAction.doAction(UICellUnshade);
                this.type = CELL_TYPE.NONE_SHADE;
                break;
        }
        this._signalChangeType.trigger(this);
    }

    showInvaldCoords() {
        this.uiCellAction.doAction(UICellInvalidCoord);
        this.type = CELL_TYPE.INVALID_COORDS;
    }

    showInvaldArea() {
        this.uiCellAction.doAction(UICellInvalidArea);
        this.type = CELL_TYPE.INVALID_AREA;
    }

}


