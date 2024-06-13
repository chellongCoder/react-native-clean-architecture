import GetListSubjectResponse from '../application/types/GetListSubjectResponse';
import GetUserProfileResponse from '../application/types/GetUserProfileResponse';
import {LoginUsernamePasswordPayload} from '../application/types/LoginPayload';
import {RegisterChildPayload} from '../application/types/RegisterChildPayload';
import RegisterChildResponse from '../application/types/RegisterChildResponse';
import {RegisterPayload} from '../application/types/RegisterPayload';
import RegisterResponse from '../application/types/RegisterResponse';
import AuthenticationEntity from './entities/Authentication';

export const IAuthenticationRepositoryToken = Symbol(
  'IAuthenticationRepository',
);

export interface IAuthenticationRepository {
  loginWithCredentials: (
    data: LoginUsernamePasswordPayload,
  ) => Promise<AuthenticationEntity>;

  registerUser: (data: RegisterPayload) => Promise<RegisterResponse>;

  registerChild: (data: RegisterChildPayload) => Promise<RegisterChildResponse>;

  getListAllSubject: () => Promise<GetListSubjectResponse>;

  getUserProfile: () => Promise<GetUserProfileResponse>;
}
