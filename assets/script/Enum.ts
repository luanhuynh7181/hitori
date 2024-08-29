

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
    ON_CLICK_BUTTON = 3,
}

export enum PACK_TYPE {
    CLASSIC = 0,
    DAILY = 1,
    CUSTOM = 2
}

export enum TUT_STEP {
    RULE_TARGET = 0,
    INVALID_COORDS = 1,
    INVALID_AREA = 2,
    SHOW_MARKED = 3,
    FINISH = 4,
    PLAY = 5
}