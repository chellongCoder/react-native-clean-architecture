import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';

export type TokenAppT = {
  token: string;
  category: AppCategoryE;
};
export type AppBlockT = {
  android: TokenAppT[];
  ios: TokenAppT[];
};
export default interface UserSettingPayload {
  appBlocked: AppBlockT;
  deviceToken: string;
  point: number;
  childrenId: string;
}
