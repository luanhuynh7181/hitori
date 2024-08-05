import { UICell } from "./UICell";


export abstract class IUICellAction {
    abstract execute(cell: UICell): void;
    protected updateColor(cell: UICell, color: string) {

    }
}

export class UICellUnshade extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateColor("#6B6B6B");
    }
}

export class UICellShaded extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateColor("#0A0A0A");
    }
}

export class UICellFlag extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateColor("#AE00C5");
    }
}

export class UICellInvalidCoord extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateColor("#C50000");
    }
}

export class UICellInvalidArea extends IUICellAction {
    execute(cell: UICell): void {
        cell.updateColor("#915757");
    }
}