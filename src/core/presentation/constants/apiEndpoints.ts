const API_VERSION = '/v1';
const SERVICES = {
  AUTH: '/auth',
  USER: '/user',
  SUBJECT: '/subject',
  FIELD: '/field',
  LESSON: '/lesson',
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

const getLessonEndPointServices = (path: string) => {
  return `/api${API_VERSION}${SERVICES.LESSON}/${path}`;
};

export const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN_WITH_CREDENTIALS: getAuthEndPointServices('login'),
    REFRESH_TOKEN: getAuthEndPointServices('refresh-token'),
  },
  USER: {
    REGISTER: getUserEndPointServices('register'),
    REGISTER_CHILD: getUserEndPointServices('register-children'),
    PROFILE: getUserEndPointServices('profile'),
    COMPARE_PASSWORD: getUserEndPointServices('compare-password'),
    CHANGE_PARENT_NAME: getUserEndPointServices('change-parent-name'),
  },
  SUBJECT: {
    LIST_ALL_SUBJECT: getSubjectEndPointServices('list-all-subject'),
    LIST_SUBJECT_OF_FIELD: getSubjectEndPointServices('list-subject-of-field'),
  },
  LESSON: {
    LISTLESSONOFSUBJECT: getLessonEndPointServices('list-lesson-of-subject'),
  },
  FIELD: getFieldEndPointServices(),
};
