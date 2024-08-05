import { UICell } from "./UICell";
import { IUICellAction, UICellUnshade } from "./UICellType";

export class UICellActionManager {
    private _currentAction: IUICellAction;
    private _cell: UICell;

    constructor(uiCell: UICell) {
        this._cell = uiCell;
        this._currentAction = new UICellUnshade();
    }

    doAction(ActionClass: new () => IUICellAction): void {
        this._currentAction = new ActionClass() as IUICellAction;
        this.executeAction();
    }

    executeAction(): void {
        this._currentAction.execute(this._cell);
    }
}
