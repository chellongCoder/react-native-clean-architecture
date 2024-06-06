import {LoginUsernamePasswordPayload} from '../application/types/LoginPayload';
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
}
