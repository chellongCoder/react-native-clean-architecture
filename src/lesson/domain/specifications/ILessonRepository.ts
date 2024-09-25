import UserSettingResponse from 'src/lesson/application/types/UserSettingResponse';
import UserSettingPayload from 'src/lesson/application/types/UserSettingPayload';
import PostUserProgressResponse from 'src/lesson/application/types/PostUserProgressResponse';
import {TResult} from 'src/lesson/presentation/screens/LessonScreen';
import ReportProgressChildrenResponse from 'src/lesson/application/types/ReportProgressChildrenResponse';
import ReportProgressChildrenPayload from 'src/lesson/application/types/ReportProgressChildrenPayload';
import RankingOfChildPayload from 'src/lesson/application/types/RankingOfChildPayload';
import RankingOfChildResponse from 'src/lesson/application/types/RankingOfChildResponse';
import TopRankingPayload from 'src/lesson/application/types/TopRankingPayload';
import TopRankingResponse from 'src/lesson/application/types/TopRankingResponse';
import {ChangeChildPointFlowerPayload} from 'src/authentication/application/types/ChangeChildPointFlowerPayload';
import {ChangeChildPointFlowerResponse} from 'src/authentication/application/types/ChangeChildPointFlowerResponse';

export const ILessonRepositoryToken = Symbol('ILessonRepository');

export interface ILessonRepository {
  updateBlockedApp: (
    payload: UserSettingPayload,
  ) => Promise<UserSettingResponse>;
  getReportProgressChildren: (
    payload: ReportProgressChildrenPayload,
  ) => Promise<ReportProgressChildrenResponse>;
  getRankingOfChild: (
    payload: RankingOfChildPayload,
  ) => Promise<RankingOfChildResponse>;
  getTopRanking: (payload: TopRankingPayload) => Promise<TopRankingResponse>;
  postUserProgress: (payload: TResult[]) => Promise<PostUserProgressResponse>;
  getSettingDevice: (
    deviceToken: string,
    childrenId: string,
  ) => Promise<UserSettingResponse>;
  changePointFlowerChild: (
    data: ChangeChildPointFlowerPayload,
  ) => Promise<ChangeChildPointFlowerResponse>;
}
