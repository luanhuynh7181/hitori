import { clamp, EventTouch, Node, UITransform, v3 } from 'cc';
import { DataBoard } from '../data/DataBoard';
import { UICell } from './ui_cell/UICell';
export class BoardToucher {
    constructor(private node: Node, private dataBoard: DataBoard) {
        this.addTouchListener(node);
    }
    addTouchListener(node: Node) {
        node.on(Node.EventType.TOUCH_START, this.onTouchBegin, this);
        node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    getCellOnTouch(event: EventTouch): UICell {
        const touch = event.getUILocation();
        console.log('touch', touch.x, touch.y);
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(touch.x, touch.y, 0));
        const boardWidth = this.node.getComponent(UITransform).width;
        const sizeBoard = this.dataBoard.board.length
        const cellSize = boardWidth / this.dataBoard.board.length;
        let column = Math.floor((pos.x + boardWidth / 2) / cellSize);
        column = clamp(column, 0, sizeBoard - 1);
        let row = Math.floor((-pos.y + boardWidth / 2) / cellSize);
        row = clamp(row, 0, sizeBoard - 1);
        // return this.cells[column][row];
        return null
    }

    onTouchBegin(event: EventTouch) {
        // const cell = this.getCellOnTouch(event);
    }

    onTouchMove(event: EventTouch) {
    }

    onTouchEnd(event: EventTouch) {
    }
}
