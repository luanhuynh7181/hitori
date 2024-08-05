import { CELL_TYPE } from "./Enum";

// create type for board with row column
export type Tcoords = {
    row: number;
    column: number;
};


export type SignalChangeType = {
    typeChange: CELL_TYPE;
    coords: Tcoords;
}