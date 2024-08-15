import { CELL_TYPE, PACK_TYPE } from "./Enum";
import { Node } from 'cc';
// create type for board with row column
export type Tcoords = {
    row: number;
    column: number;
};


export type SignalChangeType = {
    typeChange: CELL_TYPE;
    coords: Tcoords;
}

export type TCellPriority = {
    isInvalidCoords: boolean;
    isShaded: boolean;
    isFlag: boolean;
    isInvalidArea: boolean;
    isNormal: boolean;
}

export const TCellPriorityInit: TCellPriority = {
    isInvalidCoords: false,
    isShaded: false,
    isFlag: false,
    isInvalidArea: false,
    isNormal: false
};

export type BoardInfo = {
    packType: PACK_TYPE
    boardSize: number
    boardIndex: number
}

export type TTransitionInfo = {
    node: Node,
    duration: number,
    delay: number,
    deltaX: number,
    deltaY: number,
}