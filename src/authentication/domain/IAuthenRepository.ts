import {AssignChildrenPayload} from '../application/types/AssignChildrenPayload';
import {AssignChildrenResponse} from '../application/types/AssignChildrenResponse';
import {ChangeParentNamePayload} from '../application/types/ChangeParentNamePayload';
import {ChangeParentNameResponse} from '../application/types/ChangeParentNameResponse';
import {ComparePasswordPayload} from '../application/types/ComparePasswordPayload';
import {ComparePasswordResponse} from '../application/types/ComparePasswordResponse';
import DeleteChildrenResponse from '../application/types/DeleteChildrenResponse';
import GetListSubjectResponse from '../application/types/GetListSubjectResponse';
import GetUserProfileResponse from '../application/types/GetUserProfileResponse';
import {LoginUsernamePasswordPayload} from '../application/types/LoginPayload';
import {RefreshTokenResponse} from '../application/types/LoginResponse';
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

  getRefreshToken: (refreshToken: string) => Promise<RefreshTokenResponse>;

  logOut: () => Promise<void>;

  comparePassword: (
    data: ComparePasswordPayload,
  ) => Promise<ComparePasswordResponse>;

  changeParentName: (
    data: ChangeParentNamePayload,
  ) => Promise<ChangeParentNameResponse>;

  assignChildren: (
    data: AssignChildrenPayload,
  ) => Promise<AssignChildrenResponse>;

  deleteChildren: (childrenId: string) => Promise<DeleteChildrenResponse>;
}
