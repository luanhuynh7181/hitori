import { UICell } from "./UICell";


export abstract class IUICellAction {
    abstract execute(cell: UICell): void;
    protected updateColor(cell: UICell, color: string) {
    }
}

export class UICellUnshade extends IUICellAction {
    public static colors = ["#97A5A9", "#B0BABD", "#9FAEB2", "#A0AFB6"];
    execute(cell: UICell): void {
        cell.updateStyle(this.randomColor(), "#000000");
    }

    randomColor(): string {
        return UICellUnshade.colors[Math.floor(Math.random() * UICellUnshade.colors.length)];
    }
}

export class UICellShaded extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateStyle("#173438", "#FFFFFF");
    }
}

export class UICellFlag extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateStyle("#ADBC2F", "#FFFFFF");
    }
}

export class UICellInvalidCoord extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateStyle("#C50000", "#FFFFFF");
    }
}

export class UICellInvalidArea extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateStyle("#EE8300", "#FFFFFF");
    }
}

export class UICellInvalidNumber extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateStyle("#3177A1", "#FFFFFF");
    }
}