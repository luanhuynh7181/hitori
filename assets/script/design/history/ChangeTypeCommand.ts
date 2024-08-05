import { CELL_TYPE } from "../../Enum";
import { UICell } from "../../ui/ui_cell/UICell";

export class ChangeTypeCommand {
    public actor: UICell;
    private lastType: CELL_TYPE;
    private curType: CELL_TYPE;

    constructor(actor: UICell, type: CELL_TYPE) {
        this.actor = actor;
        this.lastType = actor.type;
        this.curType = type;
    }

    execute(): void {
        this.actor.onChangeType(this.curType);
    }

    undo(): void {
        this.actor.onChangeType(this.lastType);
    }
}