import {AppBlockT} from 'src/lesson/application/types/UserSettingPayload';

export default interface UserSettingEntity {
  _id: string;
  childrenId: string;
  deviceToken: string;
  appBlocked: AppBlockT;
}
