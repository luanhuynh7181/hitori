import { TCellPriority, TCellPriorityInit } from "../../Type";
import { UICell } from "../../ui/ui_cell/UICell";

export class ChangeTypeCommand {
    private data: TCellPriority[][] = [];
    private uiCells: UICell[][];
    constructor(uiCells: UICell[][]) {
        this.uiCells = uiCells;
        for (let i = 0; i < uiCells.length; i++) {
            const row: TCellPriority[] = [];
            for (let j = 0; j < uiCells[i].length; j++) {
                const cellPriority: TCellPriority = { ...uiCells[i][j].priority };
                cellPriority.isShaded = uiCells[i][j].dataCell.isShaded;
                row.push(cellPriority);
            }
            this.data.push(row);
        }
    }

    execute(): void {
        for (let i = 0; i < this.uiCells.length; i++) {
            for (let j = 0; j < this.uiCells[i].length; j++) {
                const cell: UICell = this.uiCells[i][j];
                cell.priority = { ...this.data[i][j] };
                cell.dataCell.isShaded = cell.priority.isShaded;
                cell.updateUIByPriority();
            }
        }
    }
}