import { _decorator, Component, instantiate, Node, Scene, view } from 'cc';
import { LayoutGame } from './LayoutGame';
import { PACK_TYPE, TUT_STEP } from '../../Enum';
import { PopupTut } from '../../nodeComponent/PopupTut';
import { UICell } from '../../ui/ui_cell/UICell';
import { TCellPriorityInit, Tcoords } from '../../Type';
import { IDataCell } from '../../data/DataCell';
export class LayoutGameTut {
    private LayoutGame: LayoutGame;
    private popupTut: Node;
    private tutStep: number = TUT_STEP.RULE_TARGET;
    constructor(private nodeLayoutGame: Node, private nodeGame: Node) {
        const layoutGame = nodeLayoutGame.getComponent(LayoutGame);
        this.LayoutGame = layoutGame;
        layoutGame.onShow({ packType: PACK_TYPE.CLASSIC, boardSize: 4, boardIndex: 0 });
        this.addPopupTutorial();
        layoutGame.checkWin = () => { };
        const popupTut = this.popupTut.getComponent(PopupTut);
        popupTut.setCbNextTut(this.onNextTutorial.bind(this));
        popupTut.setCbExitTut(this.onClickExit.bind(this));
        popupTut.showFirstRule();
    }

    getLayoutGame(): LayoutGame {
        return this.LayoutGame;
    }

    addPopupTutorial() {
        const popupTut = instantiate(this.getLayoutGame().popupTut);
        this.LayoutGame.node.addChild(popupTut);
        this.popupTut = popupTut;
        const screenSize = view.getVisibleSize();
        popupTut.setPosition(-screenSize.width / 2, 0);
    }

    onNextTutorial() {
        this.tutStep++;

        this.resetUICell();
        switch (this.tutStep) {
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

    showInvalidCoords() {
        const popupTut = this.popupTut.getComponent(PopupTut);
        popupTut.showInvalidCoords();
        const layerGame: LayoutGame = this.getLayoutGame();
        const data: IDataCell[][] = layerGame.dataBoard.board;
        const coords: Tcoords[] = [
            { row: 0, column: 0 },
            { row: 1, column: 0 },
            { row: 3, column: 2 },
            { row: 3, column: 3 },
            { row: 1, column: 2 },
        ];
        for (const coord of coords) {
            data[coord.row][coord.column].isShaded = true;
            layerGame.updatePriorityValidCoords(coord);
        }
    }

    showMarked() {
        const popupTut = this.popupTut.getComponent(PopupTut);
        popupTut.showMarkedCell();
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
        const popupTut = this.popupTut.getComponent(PopupTut);
        popupTut.showInvalidArea();
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
        this.nodeGame.active = true;
        this.nodeLayoutGame.destroy();
    }

    showFinish() {
        const popupTut = this.popupTut.getComponent(PopupTut);
        popupTut.showFinish();
    }
}
