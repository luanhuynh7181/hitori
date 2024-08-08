import { clamp, EventMouse, EventTouch, Node, UITransform, v3 } from 'cc';
import { DataBoard } from '../data/DataBoard';
import { UICell } from './ui_cell/UICell';
import { Tcoords } from '../Type';
export class BoardMouse {
    private lastMove: Tcoords = { row: -1, column: -1 };
    constructor(
        private node: Node,
        private dataBoard: DataBoard,
        private onHoverCell: (coords: Tcoords) => void,
        private onLeftClick: (coords: Tcoords) => void,
        private onRightClick: (coords: Tcoords) => void) {
        node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    public updateDataBoard(dataBoard: DataBoard) {
        this.dataBoard = dataBoard;
    }

    addTouchListener(node: Node) {
        node.on(Node.EventType.TOUCH_START, this.onTouchBegin, this);
        node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    getCellOnTouch(event: EventMouse): Tcoords {
        const touch = event.getUILocation();
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(touch.x, touch.y, 0));
        const boardWidth = this.node.getComponent(UITransform).width;
        const sizeBoard = this.dataBoard.board.length
        const cellSize = boardWidth / this.dataBoard.board.length;
        let column = Math.floor((pos.x + boardWidth / 2) / cellSize);
        column = clamp(column, 0, sizeBoard - 1);
        let row = Math.floor((-pos.y + boardWidth / 2) / cellSize);
        row = clamp(row, 0, sizeBoard - 1);
        return { row, column };
    }


    onMouseMove(event: EventMouse) {
        const coords = this.getCellOnTouch(event);
        if (this.lastMove.row === coords.row && this.lastMove.column === coords.column) {
            return;
        }
        this.lastMove = coords;
        this.onHoverCell(coords);
    }

    onMouseDown(event: EventMouse) {
        const coords = this.getCellOnTouch(event);
        switch (event.getButton()) {
            case EventMouse.BUTTON_LEFT:
                this.onLeftClick(coords);
                break;
            case EventMouse.BUTTON_RIGHT:
                this.onRightClick(coords);
                break;
            default:
                break;
        }
    }


    onTouchBegin(event: EventTouch) {
        // const cell = this.getCellOnTouch(event);
    }

    onTouchMove(event: EventTouch) {
    }

    onTouchEnd(event: EventTouch) {
    }
}
