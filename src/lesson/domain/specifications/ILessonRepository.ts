import UserSettingResponse from 'src/lesson/application/types/UserSettingResponse';
import UserSettingPayload from 'src/lesson/application/types/UserSettingPayload';
import PostUserProgressResponse from 'src/lesson/application/types/PostUserProgressResponse';
import {TResult} from 'src/lesson/presentation/screens/LessonScreen';

export const ILessonRepositoryToken = Symbol('ILessonRepository');

export interface ILessonRepository {
  updateBlockedApp: (
    payload: UserSettingPayload,
  ) => Promise<UserSettingResponse>;
  postUserProgress: (payload: TResult[]) => Promise<PostUserProgressResponse>;
}
