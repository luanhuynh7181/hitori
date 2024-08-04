import { isValid } from "cc";


type BoardCell = { val: number };
const EMPTY = 0;
const BLACK = -1;


const GenBoard = {
    gen: function (size: number) {
        let arr: number[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => EMPTY));
        const randomBlack: number[][] = GenBlack.take(arr);
        console.log('----------randomBlack----------');
        console.table(randomBlack);

        const randomNumber: number[][] = GenNumber.take(randomBlack);
        console.log('----------randomNumber----------');
        console.table(randomNumber);

        const board: number[][] = GenBlackValue.take(randomNumber);
        console.log('----------board----------');
        console.table(board);

    }
}

const GenBlackValue = {
    take: function (arr: number[][]) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[i][j] === BLACK) {
                    this.randomNumber(arr, i, j);
                }
            }
        }
        return arr;
    },

    randomNumber: function (arr: number[][], row: number, col: number) {
        const { length } = arr;
        const set = new Set<number>();
        for (let i = 0; i < length; i++) {
            set.add(arr[row][i]);
            set.add(arr[i][col]);
        }
        const arrNumber = Array.from(set);
        const randomIndex = Math.floor(Math.random() * arrNumber.length);
        arr[row][col] = arrNumber[randomIndex];
    }
}

const GenNumber = {
    take: function (arr: number[][]): number[][] {
        const cellsEmpty = this.getAllCellEmpty(arr);
        const bk = (idx: number): boolean => {
            if (idx === cellsEmpty.length) return true;
            const randomOke = this.randomValueCell(arr, cellsEmpty[idx].row, cellsEmpty[idx].col);
            if (randomOke) {
                return bk(idx + 1);
            } else {
                return bk(idx - 1);
            }
        }
        bk(0);
        return arr;
    },

    getAllCellEmpty: function (arr: number[][]): { row: number, col: number }[] {
        const result: { row: number, col: number }[] = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[i][j] === EMPTY) {
                    result.push({ row: i, col: j });
                }
            }
        }
        return result;
    },

    randomValueCell: function (arr: number[][], row: number, col: number): boolean {
        const { length } = arr;
        const map = new Map<number, boolean>();
        for (let i = 0; i < length; i++) {
            const rowValue: number = arr[row][i];
            map.set(rowValue, true);
            const colValue: number = arr[i][col];
            map.set(colValue, true);
        }
        const randomValue = [];
        for (let i = 1; i <= length; i++) {
            if (!map.has(i)) {
                randomValue.push(i);
            }
        }
        if (randomValue.length === 0) {
            return false;
        }
        arr[row][col] = randomValue[Math.floor(Math.random() * randomValue.length)];
        return true;
    }
}

const GenBlack = {
    take: function (arr: number[][]): number[][] {
        const { length } = arr;
        const numBlack: number = this.randomBlackCell(length);
        const allCells: { row: number, col: number }[] = this.getCellsIndexShuffe(length);
        if (numBlack === 0) return arr;
        let result: number[][] = null;
        const bk = (idx: number, numMarked: number) => {
            if (result) return;
            for (let i = idx; i < allCells.length; i++) {
                const cell = allCells[i];
                arr[cell.row][cell.col] = BLACK;
                if (this.isValidRule1(arr, cell.row, cell.col) && this.isVlaidRule2(arr, numMarked + 1)) {
                    if (numMarked + 1 === numBlack) {
                        result = arr.map(row => row.slice());
                        return;
                    }
                    bk(i + 1, numMarked + 1);
                }
                arr[cell.row][cell.col] = EMPTY;

            }
        }
        bk(0, 0);
        return result;
    },

    getCellsIndexShuffe: function (size: number): { row: number, col: number }[] {
        const arr: { row: number, col: number }[] = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                arr.push({ row: i, col: j });
            }
        }
        return arr.sort(() => Math.random() - 0.5);
    },

    directions: [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
    ],
    isValidRule1: function (arr: number[][], row: number, col: number): boolean {
        // check 4 directions is not black
        const size: number = arr.length;
        for (const direction of this.directions) {
            const newRow: number = row + direction.row;
            const newCol: number = col + direction.col;
            if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
                continue;
            }
            if (arr[newRow][newCol] === BLACK) {
                return false;
            }
        }
        return true;
    },

    isVlaidRule2: function (arr: number[][], numBlack: number): boolean {
        function findCellEmpty(): { row: number, col: number } {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (arr[i][j] === EMPTY) {
                        return { row: i, col: j };
                    }
                }
            }
            return { row: -1, col: -1 };
        }

        const dfs = (row: number, col: number) => {
            numCellEmpty++;
            arr[row][col] = BLACK;
            for (const direction of this.directions) {
                const newRow: number = row + direction.row;
                const newCol: number = col + direction.col;
                if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
                    continue;
                }
                if (arr[newRow][newCol] === EMPTY) {
                    dfs(newRow, newCol);
                }
            }
        };
        arr = arr.map(row => row.slice());
        const size: number = arr.length;
        let numCellEmpty = 0;
        const cellEmpty = findCellEmpty();
        dfs(cellEmpty.row, cellEmpty.col);
        return numCellEmpty + numBlack === size * size;
    },

    randomBlackCell: function (size: number) {
        size = size * size;
        const from = Math.floor(size * 0.25);
        const to = Math.floor(size * 0.3);
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }
}

GenBoard.gen(20);