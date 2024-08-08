

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
}