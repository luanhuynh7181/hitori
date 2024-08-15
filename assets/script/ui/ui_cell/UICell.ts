import { _decorator, Color, Component, EventTouch, instantiate, Label, Node, Prefab, Sprite, UITransform, Vec2 } from 'cc';
import { IDataCell } from '../../data/DataCell';
import { UICellActionManager } from './UICellActionManager';
import { UICellFlag, UICellInvalidArea, UICellInvalidCoord, UICellShaded, UICellUnshade } from './UICellType';
import { CELL_TYPE } from '../../Enum';
import { TCellPriority, TCellPriorityInit, Tcoords } from '../../Type';

const { ccclass, property } = _decorator;

@ccclass('UICell')
export class UICell extends Component {

    @property(Node) imgBg: Node = null;
    @property(Label) lbNumber: Label = null;

    private _dataCell: IDataCell = null;
    private uiCellAction: UICellActionManager = null;
    private _coords: Tcoords = null;
    private _type: CELL_TYPE = null;
    private _priority: TCellPriority = null;
    setup(coords: Tcoords, dataCell: IDataCell) {
        this._dataCell = dataCell;
        this.uiCellAction = new UICellActionManager(this);
        this._coords = coords;
        this._type = CELL_TYPE.NONE_SHADE;
        this._priority = { ...TCellPriorityInit };

        this.lbNumber.string = dataCell.value.toString();
        this.uiCellAction.doAction(UICellUnshade);
        this.resetColor();

    }

    public get coords(): Tcoords {
        return this._coords;
    }

    public get type(): CELL_TYPE {
        return this._type;
    }

    public get dataCell(): IDataCell {
        return this._dataCell;
    }

    public get priority(): TCellPriority {
        return this._priority;
    }

    public set priority(value: TCellPriority) {
        this._priority = value;
    }

    updateSize(size: number) {
        this.imgBg.getComponent(UITransform).width = size;
        this.imgBg.getComponent(UITransform).height = size;
        this.lbNumber.fontSize = size * 0.7;
    }

    updateUIByPriority() { // check priority and update UI compare with previous priority
        const priority: TCellPriority = this._priority;
        if (priority.isInvalidCoords) {
            this.uiCellAction.doAction(UICellInvalidCoord);
            return;
        }
        if (this.dataCell.isShaded) {
            this.uiCellAction.doAction(UICellShaded);
            return;
        }

        if (priority.isInvalidArea) {
            this.uiCellAction.doAction(UICellInvalidArea);
            return;
        }
        if (priority.isFlag) {
            this.uiCellAction.doAction(UICellFlag);
            return;
        }
        this.uiCellAction.doAction(UICellUnshade);
    }

    showCellValidNumber() {
        const hex = Color.fromHEX(new Color(), "#FF0000");
        this.lbNumber.color = hex;
    }

    resetColor() {
        const hex = Color.fromHEX(new Color(), "#FFFFFF");
        this.lbNumber.color = hex;
    }

    public updateColor(color: string) {
        const hex = Color.fromHEX(new Color(), color);
        this.imgBg.getComponent(Sprite).color = hex;
    }
}


