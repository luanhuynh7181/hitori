import { VERSION } from "../script/Constant";
import ga from 'gameanalytics';
import { BoardInfo } from "../script/Type";
import { PACK_TYPE } from "../script/Enum";
const GameAnalytics = ga.GameAnalytics;
export const GAME_ANALYTICS = {
    init: (userId: string) => {
        const GAME_KEY = "7a9b412ad4b464ae5ef83b8dd623ee13";
        const SECRECT_KEY = "3e6f3ac580bc2067da2de9ddd2a955ecfabebd14";
        GameAnalytics.setEnabledInfoLog(true);
        GameAnalytics.configureBuild(VERSION);
        GameAnalytics.configureUserId(userId);
        GameAnalytics.initialize(GAME_KEY, SECRECT_KEY);
    },

    addDesignEvent: (eventId: string, value: number) => {
        GameAnalytics.addDesignEvent(eventId, value);
    },

    trackTutorialStep: (step: number) => {
        GameAnalytics.addDesignEvent("STEP:" + step, step);
    },

    trackTimeFinishBoard: (boardInfo: BoardInfo, time: number) => {
        const key = `FINISH_BOARD:${PACK_TYPE[boardInfo.packType]}:SIZE_${boardInfo.boardSize}:INDEX_${boardInfo.boardIndex}`;
        GameAnalytics.addDesignEvent(key, time);
    },

    trackClickHint: () => {
        GameAnalytics.addDesignEvent("CLICK_HINT", 1);
    },

    trackWatchRewardAd: () => {
        GameAnalytics.addDesignEvent("WATCHED_ADS", 1);
    }
}