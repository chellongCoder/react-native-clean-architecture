/**
 * Core stack
 */
export const STACK_NAVIGATOR = {
  AUTH_NAVIGATOR: 'AUTH_NAVIGATOR',
  HOME_NAVIGATOR: 'HOME_NAVIGATOR',
  TARGET_NAVIGATOR: 'TARGET_NAVIGATOR',
  PARENT_NAVIGATOR: 'PARENT_NAVIGATOR',
  CHILD_NAVIGATOR: 'CHILD_NAVIGATOR',
  ACHIEVEMENT_NAVIGATOR: 'ACHIEVEMENT_NAVIGATOR',
  RANK_NAVIGATOR: 'RANK_NAVIGATOR',
  ONBOARDING_NAVIGATOR: 'ONBOARDING_SCREEN',

  /** AUTH */
  AUTH: {
    LOGIN_SCREEN: 'LOGIN_SCREEN',
  },
  HOME: {
    LESSON: 'LESSON_SCREEN',
    HOME_SCREEN: 'HOME_SCREEN',
    SUBJECT_SCREEN: 'SUBJECT_SCREEN',
    DONE_LESSON_SCREEN: 'DONE_LESSON_SCREEN',
  },
  /** EXPLORE */
  EXPLORE: {},
  /** LIBRARY */
  LIBRARY: {},
  /** PROFILE */
  PROFILE: {},
  /** ACHIEVEMENT */
  ACHIEVEMENT: {
    ACHIEVEMENT_SCREEN: 'ACHIEVEMENT_SCREEN',
  },
  /** RANK */
  RANK: {
    RANK_SCREEN: 'RANK_SCREEN',
  },
  /**
   * Tab name
   */
  BOTTOM_TAB_SCREENS: 'BOTTOM_TAB_SCREENS',
  BOTTOM_TAB: {
    HOME_TAB: 'HOME_TAB',
    TARGET_TAB: 'TARGET_TAB',
    PARENT_TAB: 'PARENT_TAB',
    CHILD_TAB: 'CHILD_TAB',
    ACHIEVEMENT_TAB: 'ACHIEVEMENT_TAB',
    RANK_TAB: 'RANK_TAB',
  },
};

/**
 * Config Navigator
 */
export const CONFIG = {
  HEADER: {
    NONE: 'none',
    FLOAT: 'float',
    SCREEN: 'screen',
  },
  HEADER_TITLE: {
    NONE: '',
  },
  HEADER_ALIGN: {
    LEFT: {
      headerTitleAlign: 'left',
    },
    CENTER: {
      headerTitleAlign: 'center',
    },
  },
  SWIPE_BACK: {
    FALSE: false,
  },
  FADE_SCREEN: {
    cardStyleInterpolator: ({current}: any) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  },
};
