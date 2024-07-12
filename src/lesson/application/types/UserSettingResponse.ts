import UserSettingEntity from 'src/lesson/domain/entities/UserSettingEntity';

export default interface UserSettingResponse {
  message: string;
  code: number;
  userSettingEntity: UserSettingEntity;
  createdAt: string;
  point: number;
  updatedAt: string;
}
