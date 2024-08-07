
class BoardGame {
    constructor(private _data: number[][], private _solution: number[][]) {
    }

    public get data(): number[][] {
        return this._data;
    }

    public get solution(): number[][] {
        return this._solution;
    }
}

export default BoardGame;