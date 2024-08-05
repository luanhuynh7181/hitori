import { Color, Component, Sprite } from "cc";
import { UICell } from "./UICell";


export abstract class IUICellAction {
    abstract execute(cell: UICell): void;
    protected updateColor(cell: UICell, color: string) {
        const hex = Color.fromHEX(new Color(), color);
        cell.imgBg.getComponent(Sprite).color = hex;
    }
}

export class UICellUnshade extends IUICellAction {
    execute(cell: UICell): void {
        this.updateColor(cell, "#6B6B6B");
    }
}

export class UICellShaded extends IUICellAction {
    execute(cell: UICell): void {
        this.updateColor(cell, "#0A0A0A");
    }
}

export class UICellFlag extends IUICellAction {
    execute(cell: UICell): void {
        this.updateColor(cell, "#AE00C5");
    }
}

export class UICellInvalidCoord extends IUICellAction {
    execute(cell: UICell): void {
        this.updateColor(cell, "#C50000");
    }
}

export class UICellInvalidArea extends IUICellAction {
    execute(cell: UICell): void {
        this.updateColor(cell, "#915757");
    }
}