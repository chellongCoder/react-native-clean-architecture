import {children} from 'src/authentication/application/types/GetUserProfileResponse';

type AuthenticationStoreState = {
  isLoading: boolean;
  token: string;
  refreshToken: string;
  error: string;
  selectedChild: children | undefined;
};

export default AuthenticationStoreState;
