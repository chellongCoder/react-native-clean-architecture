const API_VERSION = '/v1';
const SERVICES = {
  AUTH: '/auth',
  USER: '/user',
  SUBJECT: '/subject',
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

export const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN_WITH_CREDENTIALS: getAuthEndPointServices('login'),
    REFRESH_TOKEN: getAuthEndPointServices('refresh-token'),
  },
  USER: {
    REGISTER: getUserEndPointServices('register'),
    REGISTER_CHILD: getUserEndPointServices('register-children'),
    PROFILE: getUserEndPointServices('profile'),
  },
  SUBJECT: {
    LIST_ALL_SUBJECT: getSubjectEndPointServices('list-all-subject'),
  },
};
