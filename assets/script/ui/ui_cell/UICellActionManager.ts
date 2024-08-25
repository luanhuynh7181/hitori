import { UICell } from "./UICell";
import { IUICellAction, UICellUnshade } from "./UICellType";

export class UICellActionManager {
    private _currentAction: IUICellAction;
    private _cell: UICell;

    constructor(uiCell: UICell) {
        this._cell = uiCell;
        this._currentAction = null;
    }

    doAction(ActionClass: new () => IUICellAction): void {
        if (this._currentAction instanceof ActionClass) return;
        this._currentAction = new ActionClass() as IUICellAction;
        this.executeAction();
    }

    executeAction(): void {
        this._currentAction.execute(this._cell);
    }
}
