import { clamp, EventMouse, EventTouch, Node, sys, UITransform, v3 } from 'cc';
import { DataBoard } from '../data/DataBoard';
import { UICell } from './ui_cell/UICell';
import { Tcoords } from '../Type';
export class BoardMouse {
    private lastMove: Tcoords = { row: -1, column: -1 };
    constructor(
        private node: Node,
        private dataBoard: UICell[][],
        private imgTarget: Node,
        private onLeftClick: (coords: Tcoords) => void,
        private onRightClick: (coords: Tcoords) => void,
        private onClick: (coords: Tcoords) => void
    ) {
        if (sys.platform === sys.Platform.MOBILE_BROWSER) {
            this.addTouchListener(node);
            return;
        }
        if (sys.platform === sys.Platform.DESKTOP_BROWSER) {
            this.addMouseListener(node);
            return;
        }
    }

    public setup(dataBoard: UICell[][], imgSize: number) {
        this.dataBoard = dataBoard;
        this.imgTarget.getComponent(UITransform).width = imgSize;
        this.imgTarget.getComponent(UITransform).height = imgSize;
        this.imgTarget.setSiblingIndex(1000);
    }

    addMouseListener(node: Node) {
        node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    addTouchListener(node: Node) {
        node.on(Node.EventType.TOUCH_START, this.onTouchBegin, this);
        node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        node.on(Node.EventType.TOUCH_CANCEL, this.onTouchLeave, this);
    }

    getCellOnTouch(event: EventMouse | EventTouch): Tcoords {
        const touch = event.getUILocation();
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(touch.x, touch.y, 0));
        const boardWidth = this.node.getComponent(UITransform).width;
        const sizeBoard = this.dataBoard.length
        const cellSize = boardWidth / this.dataBoard.length;
        let column = Math.floor((pos.x + boardWidth / 2) / cellSize);
        let row = Math.floor((-pos.y + boardWidth / 2) / cellSize);
        if (column < 0 || column >= sizeBoard || row < 0 || row >= sizeBoard) {
            return null;
        }
        return { row, column };
    }


    onMouseMove(event: EventMouse | EventTouch) {
        const coords = this.getCellOnTouch(event);
        if (!coords) return;
        if (this.lastMove.row === coords.row && this.lastMove.column === coords.column) {
            return;
        }
        this.lastMove = coords;
        this.imgTarget.setPosition(this.dataBoard[coords.row][coords.column].node.getPosition());
    }

    onMouseDown(event: EventMouse) {
        const coords = this.getCellOnTouch(event);
        if (!coords) return;
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
        const coords = this.getCellOnTouch(event);
        if (!coords) return;
        this.onClick(coords);
    }

    onTouchMove(event: EventTouch) {
    }

    onTouchEnd(event: EventTouch) {
    }

    onTouchLeave(event: EventTouch) {
    }

    onMouseLeave() {
        this.imgTarget.active = false;
    }

    onMouseEnter() {
        this.imgTarget.active = true;
    }
}
