import BoardConfig from "./BoardConfig";


export default class PackConfig {
    private boardConfig: Map<number, BoardConfig[]> = new Map();

    public addBoardConfig(boardSize: number, boardConfig: BoardConfig[]) {
        this.boardConfig.set(boardSize, boardConfig);
    }

    public getAllBoardSize(): number[] {
        return Array.from(this.boardConfig.keys()).sort((a, b) => a - b);
    }

    public getBoardConfigSortedBySize(): { size: number, boardConfig: BoardConfig[] }[] {
        return this.getAllBoardSize().map(size => ({ size, boardConfig: this.boardConfig.get(size) }));
    }

    public getBoardConfig(boardSize: number): BoardConfig[] {
        return this.boardConfig.get(boardSize);
    }
}
