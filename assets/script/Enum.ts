

export const enum CELL_TYPE {
    NONE_SHADE = 0,
    SHADED = 1,
    FLAG = 2,
    INVALID_COORDS = 3,
    INVALID_AREA = 4,
}

export const enum GAME_LAYOUT {
    LOBBY = 1,
    BOARD = 2,
    GAME = 3
};

export const enum EVENT_TYPE {
    SWITCH_LAYOUT = 1,
    ONCLICK_ITEM_BOARD = 2,
}

export enum PACK_TYPE {
    CLASSIC = 0,
    DAILY = 1,
    CUSTOM = 2
}

export enum TUT_STEP {
    RULE_TARGET = 1,
    INVALID_COORDS = 2,
    INVALID_AREA = 3,
    SHOW_MARKED = 4,
    FINISH = 5,
    PLAY = 6
}