import UserSettingResponse from 'src/lesson/application/types/UserSettingResponse';
import UserSettingPayload from 'src/lesson/application/types/UserSettingPayload';
import PostUserProgressResponse from 'src/lesson/application/types/PostUserProgressResponse';
import {TResult} from 'src/lesson/presentation/screens/LessonScreen';
import ReportProgressChildrenResponse from 'src/lesson/application/types/ReportProgressChildrenResponse';
import ReportProgressChildrenPayload from 'src/lesson/application/types/ReportProgressChildrenPayload';

export const ILessonRepositoryToken = Symbol('ILessonRepository');

export interface ILessonRepository {
  updateBlockedApp: (
    payload: UserSettingPayload,
  ) => Promise<UserSettingResponse>;
  getReportProgressChildren: (
    payload: ReportProgressChildrenPayload,
  ) => Promise<ReportProgressChildrenResponse>;
  postUserProgress: (payload: TResult[]) => Promise<PostUserProgressResponse>;
  getSettingDevice: (
    deviceToken: string,
    childrenId: string,
  ) => Promise<UserSettingResponse>;
}
