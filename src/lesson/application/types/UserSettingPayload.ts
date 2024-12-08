import {AppCategoryE} from 'src/core/domain/enums/AppCategoryE';

export type TokenAppT = {
  token: string;
  category: AppCategoryE;
};

export type TokenAppAndroidT = {
  token: string;
  category: AppCategoryE;
  id: string;
  name: string;
  icon?: string;
};

export type AppBlockT = {
  android: TokenAppAndroidT[];
  ios: TokenAppT[];
};

export type BlockedModuleSetting = {
  percent: number;
  moduleId: string;
};
export default interface UserSettingPayload {
  appBlocked?: AppBlockT;
  deviceToken: string;
  point?: number;
  childrenId: string;
  modules: BlockedModuleSetting[];
}
