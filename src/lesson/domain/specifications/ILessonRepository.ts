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
import PurchaseModulePayload from 'src/lesson/application/types/PurchaseModulePayload';
import PurchaseModuleResponse from 'src/lesson/application/types/PurchaseModuleResponse';
import {GetListSubjectPayload} from 'src/home/application/types/GetListSubjectPayload';
import GetListLessonResponse from 'src/home/application/types/GetListLessonResponse';
import {ImageToTextResponse} from 'src/authentication/application/types/ImageToTextResponse';
import BuyUserModulePayload from 'src/lesson/application/types/BuyUserModulePayload';
import BuyUserModuleResponse from 'src/lesson/application/types/BuyUserModuleResponse';
import {GetUserModuleResponse} from 'src/lesson/application/types/GetUserModuleResponse';
import {TranslateTextPayload} from 'src/authentication/application/types/TranslateTextPayload';
import {TranslateTextResponse} from 'src/authentication/application/types/TranslateTextResponse';

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
  imageToText: (data: FormData) => Promise<ImageToTextResponse>;
  translateText: (data: TranslateTextPayload) => Promise<TranslateTextResponse>;
  changePointFlowerChild: (
    data: ChangeChildPointFlowerPayload,
  ) => Promise<ChangeChildPointFlowerResponse>;
  purchaseModule: (
    payload: PurchaseModulePayload,
  ) => Promise<PurchaseModuleResponse>;
  getProductFromBE: () => Promise<any>;
  getListLessonByField: ({
    fieldId,
  }: GetListSubjectPayload) => Promise<GetListLessonResponse>;
  getUserModule: () => Promise<GetUserModuleResponse>;
  buyUserModule: (
    payload: BuyUserModulePayload,
  ) => Promise<BuyUserModuleResponse>;
}
