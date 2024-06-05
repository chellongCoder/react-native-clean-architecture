import {LoginUsernamePasswordPayload} from '../application/types/LoginPayload';
import AuthenticationEntity from './entities/Authentication';

export const IAuthenticationRepositoryToken = Symbol(
  'IAuthenticationRepository',
);

export interface IAuthenticationRepository {
  loginWithCredentials: (
    data: LoginUsernamePasswordPayload,
  ) => Promise<AuthenticationEntity>;
}
