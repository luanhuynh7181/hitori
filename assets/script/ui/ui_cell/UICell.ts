import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab, UITransform, Vec2 } from 'cc';
import { DataCell } from '../../data/DataCell';
import { UICellActionManager } from './UICellActionManager';
import { UICellFlag, UICellInvalidArea, UICellInvalidCoord, UICellShaded, UICellUnshade } from './UICellType';
import { CELL_TYPE } from '../../Enum';
import { Signal } from '../../design/Observer';
import { SignalChangeType, Tcoords } from '../../Type';

const { ccclass, property } = _decorator;

@ccclass('UICell')
export class UICell extends Component {

    @property(Node) imgBg: Node = null;
    @property(Label) lbNumber: Label = null;

    private _dataCell: DataCell = null;
    private uiCellAction: UICellActionManager = null;
    private _coords: Tcoords = null;
    private _type: CELL_TYPE = null;
    private _signalChangeType: Signal<SignalChangeType> = null;

    setup(coords: Tcoords, dataCell: DataCell, signalChangeType: Signal<SignalChangeType>) {
        this._dataCell = dataCell;
        this._coords = coords;
        this._signalChangeType = signalChangeType;

        this.lbNumber.string = dataCell.value.toString();
        this.uiCellAction = new UICellActionManager(this);
        this.uiCellAction.doAction(UICellUnshade);
        this._type = CELL_TYPE.NONE_SHADE;
        this.imgBg.on(Node.EventType.TOUCH_START, this.onTouchBegin, this);
    }

    public get coords(): Tcoords {
        return this._coords;
    }

    public get type(): CELL_TYPE {
        return this._type;
    }

    public get signalChangeType(): Signal<SignalChangeType> {
        return this._signalChangeType;
    }


    updateSize(size: number) {
        this.imgBg.getComponent(UITransform).width = size;
        this.imgBg.getComponent(UITransform).height = size;
        this.lbNumber.fontSize = size * 0.7;
    }

    onTouchBegin(event: EventTouch) {
        let typeChange = this._type;
        switch (this._type) {
            case CELL_TYPE.NONE_SHADE:
                typeChange = CELL_TYPE.SHADED;
                break;
            case CELL_TYPE.SHADED:
                typeChange = CELL_TYPE.FLAG;
                break;
            case CELL_TYPE.FLAG:
                typeChange = CELL_TYPE.NONE_SHADE;
                break;
        }
        this.emitSignalChangeType(typeChange);
    }

    emitSignalChangeType(type: CELL_TYPE) {
        this._signalChangeType.trigger({ typeChange: type, coords: this._coords });
    }


    onChangeType(type: CELL_TYPE) {
        this._type = type;
        switch (type) {
            case CELL_TYPE.NONE_SHADE:
                this.uiCellAction.doAction(UICellUnshade);
                break;
            case CELL_TYPE.SHADED:
                this.uiCellAction.doAction(UICellShaded);
                break;
            case CELL_TYPE.FLAG:
                this.uiCellAction.doAction(UICellFlag);
                break;
        }
    }

    showInvaldCoords() {
        this.uiCellAction.doAction(UICellInvalidCoord);
        this._type = CELL_TYPE.INVALID_COORDS;
    }

    showInvaldArea() {
        this.uiCellAction.doAction(UICellInvalidArea);
        this._type = CELL_TYPE.INVALID_AREA;
    }

}


