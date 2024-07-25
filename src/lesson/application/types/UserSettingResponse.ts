import UserSettingEntity from 'src/lesson/domain/entities/UserSettingEntity';

export default interface UserSettingResponse {
  message: string;
  code: number;
  data: UserSettingEntity | null;
  createdAt: string;
  point: number;
  updatedAt: string;
}
