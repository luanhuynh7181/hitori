import { Tcoords } from "./Type";


export class Utility {
    public static getAllDirection(): Tcoords[] {
        return [
            { row: -1, column: 0 },
            { row: 1, column: 0 },
            { row: 0, column: -1 },
            { row: 0, column: 1 }
        ]
    }
}