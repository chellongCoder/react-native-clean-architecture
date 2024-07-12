import UserSettingResponse from 'src/lesson/application/types/UserSettingResponse';
import UserSettingPayload from 'src/lesson/application/types/UserSettingPayload';

export const ILessonRepositoryToken = Symbol('ILessonRepository');

export interface ILessonRepository {
  updateBlockedApp: (
    payload: UserSettingPayload,
  ) => Promise<UserSettingResponse>;
}
