import { _decorator, Component, instantiate, math, Node, Scene, UITransform, view } from 'cc';
import { LayoutGame } from './LayoutGame';
import { PACK_TYPE, TUT_STEP } from '../../Enum';
import { PopupTut } from '../../nodeComponent/PopupTut';
import { UICell } from '../../ui/ui_cell/UICell';
import { TCellPriorityInit, Tcoords } from '../../Type';
import { IDataCell } from '../../data/DataCell';
export class LayoutGameTut {
    constructor(private popupTut: PopupTut, private layoutGame: LayoutGame, private originLayoutGame: LayoutGame) {
        popupTut.setCbNextTut(this.onNextTutorial.bind(this));
        popupTut.setCbExitTut(this.onClickExit.bind(this));
        this.onNextTutorial(TUT_STEP.RULE_TARGET);
    }

    onResize(visibleSize: math.Size, nodeBoardGame: Node) {
        this.layoutGame.nodeBoardGame.setPosition(nodeBoardGame.getPosition());
        this.popupTut.onResize(visibleSize);
    }

    getLayoutGame(): LayoutGame {
        return this.layoutGame;
    }

    onNextTutorial(step: number) {
        this.resetUICell();
        switch (step) {
            case TUT_STEP.RULE_TARGET:
                this.showFirstRule();
                break;
            case TUT_STEP.INVALID_COORDS:
                this.showInvalidCoords();
                break;
            case TUT_STEP.INVALID_AREA:
                this.showInvalidArea();
                break;
            case TUT_STEP.SHOW_MARKED:
                this.showMarked();
                break;
            case TUT_STEP.FINISH:
                this.showFinish();
                break;
            case TUT_STEP.PLAY:
                this.onClickExit();
            default:
        }
        this.updateCellByPriority();
    }

    resetUICell() {
        const layerGame: LayoutGame = this.getLayoutGame();
        const cells: UICell[] = layerGame.cells.flat();
        for (const cell of cells) {
            cell.dataCell.isShaded = false;
            cell.priority = { ...TCellPriorityInit };
            cell.updateUIByPriority();
        }
    }

    updateCellByPriority() {
        const layerGame: LayoutGame = this.getLayoutGame();
        const cells: UICell[] = layerGame.cells.flat();
        for (const cell of cells) {
            cell.updateUIByPriority();
        }
    }

    showFirstRule() {
        this.popupTut.showFirstRule();
    }

    showInvalidCoords() {
        this.popupTut.showInvalidCoords();
        const layerGame: LayoutGame = this.getLayoutGame();
        const data: IDataCell[][] = layerGame.dataBoard.board;
        const coords: Tcoords[] = [
            { row: 0, column: 0 },
            { row: 1, column: 0 },
            { row: 2, column: 2 },
            { row: 2, column: 3 }
        ];
        for (const coord of coords) {
            data[coord.row][coord.column].isShaded = true;
            layerGame.updatePriorityValidCoords(coord);
        }
    }

    showMarked() {
        this.popupTut.showMarkedCell();
        const layerGame: LayoutGame = this.getLayoutGame();
        const data: UICell[][] = layerGame.cells
        const coords: Tcoords[] = [
            { row: 1, column: 0 },
            { row: 2, column: 1 },
            { row: 2, column: 2 },
        ];
        for (const coord of coords) {
            data[coord.row][coord.column].priority.isFlag = true;
        }
    }

    showInvalidArea() {
        this.popupTut.showInvalidArea();
        const layerGame: LayoutGame = this.getLayoutGame();
        const data: IDataCell[][] = layerGame.dataBoard.board;
        const coords: Tcoords[] = [
            { row: 0, column: 2 },
            { row: 1, column: 1 },
            { row: 2, column: 0 }
        ];
        for (const coord of coords) {
            data[coord.row][coord.column].isShaded = true;

        }
        layerGame.updatePriorityValidArea();
    }

    onClickExit() {
        this.popupTut.node.destroy();
        this.originLayoutGame.updateOrderTop(this.originLayoutGame.node);
        this.originLayoutGame.transition.runIn();
        this.originLayoutGame.layoutTutorial = null;
    }

    showFinish() {
        this.popupTut.showFinish();
        const layerGame: LayoutGame = this.getLayoutGame();
        const data: IDataCell[][] = layerGame.dataBoard.board;
        const coords: Tcoords[] = [
            { row: 0, column: 0 },
            { row: 1, column: 3 },
            { row: 3, column: 1 },
            { row: 3, column: 3 }
        ];
        for (const coord of coords) {
            data[coord.row][coord.column].isShaded = true;

        }
    }
}
