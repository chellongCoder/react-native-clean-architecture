const API_VERSION = '/v1';
const SERVICES = {
  AUTH: '/auth',
  USER: '/user',
  SUBJECT: '/subject',
  FIELD: '/field',
  LESSON: '/lesson',
  USER_SETTING: '/user-setting',
  USER_PROGRESS: '/user-progress',
  LOGGING: '/logging',
  VERIFY_GOOGLE_PAYMENT: '/google-api/verify',
  PRODUCT: '/product',
  REPORT: '/report',
  APP_VERSION: '/app-version',
};

const getProduct = () => {
  return `/api${API_VERSION}${SERVICES.PRODUCT}`;
};

const getReport = () => {
  return `/api${API_VERSION}${SERVICES.REPORT}`;
};

const getLoggingEndPointServices = () => {
  return `/api${API_VERSION}${SERVICES.LOGGING}`;
};
const getAuthEndPointServices = (path: string) => {
  return `/api${API_VERSION}${SERVICES.AUTH}/${path}`;
};

const getUserEndPointServices = (path: string) => {
  return `/api${API_VERSION}${SERVICES.USER}/${path}`;
};

const getSubjectEndPointServices = (path: string) => {
  return `/api${API_VERSION}${SERVICES.SUBJECT}/${path}`;
};

const getFieldEndPointServices = () => {
  return `/api${API_VERSION}${SERVICES.FIELD}`;
};

const getLessonSubjectEndPointServices = (path: string) => {
  return `/api${API_VERSION}${SERVICES.LESSON}/${path}`;
};

const getLessonEndPointServices = () => {
  return `/api${API_VERSION}${SERVICES.LESSON}`;
};

const getUserSettingEndPointServices = (path: string) => {
  return `/api${API_VERSION}${SERVICES.USER_SETTING}/${path}`;
};

const verifyGooglePaymentServices = () => {
  return `/api${API_VERSION}${SERVICES.VERIFY_GOOGLE_PAYMENT}`;
};

const getUserProgressEndPointServices = (path?: string) => {
  if (path) {
    return `/api${API_VERSION}${SERVICES.USER_PROGRESS}/${path}`;
  } else {
    return `/api${API_VERSION}${SERVICES.USER_PROGRESS}`;
  }
};

const getAppVersion = () => {
  return `/api${API_VERSION}${SERVICES.APP_VERSION}`;
};

export const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN_WITH_CREDENTIALS: getAuthEndPointServices('login'),
    LOGIN_WITH_GOOGLE: getAuthEndPointServices('google'),
    REFRESH_TOKEN: getAuthEndPointServices('refresh-token'),
  },
  USER: {
    REGISTER: getUserEndPointServices('register'),
    REGISTER_CHILD: getUserEndPointServices('register-children'),
    PROFILE: getUserEndPointServices('profile'),
    COMPARE_PASSWORD: getUserEndPointServices('compare-password'),
    CHANGE_PARENT_NAME: getUserEndPointServices('change-parent-name'),
    DELETE_CHILDREN: getUserEndPointServices('delete-children'),
    UPDATE_CHILDREN_DESCRIPTION: getUserEndPointServices(
      'update-children-description',
    ),
    UPDATE_CHILD_POINT: getUserEndPointServices('update-child-point'),
  },
  SUBJECT: {
    LIST_ALL_SUBJECT: getSubjectEndPointServices('list-all-subject'),
    LIST_SUBJECT_OF_FIELD: getSubjectEndPointServices('list-subject-of-field'),
  },
  LESSON: {
    LISTLESSONOFSUBJECT: getLessonSubjectEndPointServices(
      'list-lesson-of-subject',
    ),
    QUESTIONS: getLessonEndPointServices(),
  },
  FIELD: getFieldEndPointServices(),
  USER_SETTING: {
    ASSIGN_CHILDREN: getUserSettingEndPointServices('assign-children'),
    USER_SETTING: getUserSettingEndPointServices(''),
    GET_SETTING_DEVICE: getUserSettingEndPointServices('get-setting-device'),
  },
  USER_PROGRESS: {
    USER_PROGRESS: getUserProgressEndPointServices(),
    REPORT_PROGRESS_CHILDREN: getUserProgressEndPointServices(
      'report-progress-children',
    ),
    RANKING_OF_CHILD: getUserProgressEndPointServices('ranking-of-child'),
    TOP_RANKING: getUserProgressEndPointServices('top-ranking'),
  },
  DEFAULT: {
    LOGGING: getLoggingEndPointServices(),
  },
  VERIFY_PAYMENT: {
    GOOGLE: verifyGooglePaymentServices(),
  },
  GET_PRODUCT: {
    PRODUCT: getProduct(),
  },
  REPORT: {
    POST_REPORT: getReport(),
  },
  APP_VERSION: {
    APP_VERSION: getAppVersion(),
  },
};
