import GetPostsPayload from 'src/post/application/types/GetPostsPayload';
import axios from 'axios';
import {injectable, provided} from 'inversify-sugar';
import GetPostsResponse from 'src/post/application/types/GetPostsResponse';
import PostDto from '../models/PostDto';
import {plainToInstance} from 'class-transformer';
import IHttpClient, {
  IHttpClientToken,
} from 'src/core/domain/specifications/IHttpClient';
import {ILessonRepository} from 'src/lesson/domain/specifications/ILessonRepository';
import UserSettingPayload from 'src/lesson/application/types/UserSettingPayload';
import {API_ENDPOINTS} from 'src/core/presentation/constants/apiEndpoints';
import UserSettingResponse from 'src/lesson/application/types/UserSettingResponse';
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

@injectable()
class LessonRepository implements ILessonRepository {
  private readonly baseUrl = '/posts';

  constructor(
    @provided(IHttpClientToken) private readonly httpClient: IHttpClient,
  ) {}

  public async updateBlockedApp(payload: UserSettingPayload) {
    const response: UserSettingResponse = await this.httpClient.post(
      `${API_ENDPOINTS.USER_SETTING.USER_SETTING}`,
      payload,
    );

    return response;
  }

  public async get({}: GetPostsPayload): Promise<GetPostsResponse> {
    const posts = (await axios.get<unknown[]>(this.baseUrl)).data;
    const response: GetPostsResponse = {
      results: posts.map(post => plainToInstance(PostDto, post).toDomain()),
      count: posts.length,
    };

    return response;
  }

  public async getReportProgressChildren(
    payload: ReportProgressChildrenPayload,
  ): Promise<ReportProgressChildrenResponse> {
    const response: ReportProgressChildrenResponse = await this.httpClient.post(
      `${API_ENDPOINTS.USER_PROGRESS.REPORT_PROGRESS_CHILDREN}`,
      payload,
    );
    return response;
  }

  public async getRankingOfChild(
    payload: RankingOfChildPayload,
  ): Promise<RankingOfChildResponse> {
    const response: RankingOfChildResponse = await this.httpClient.post(
      `${API_ENDPOINTS.USER_PROGRESS.RANKING_OF_CHILD}`,
      payload,
    );
    return response;
  }

  public async getTopRanking(
    payload: TopRankingPayload,
  ): Promise<TopRankingResponse> {
    const response: TopRankingResponse = await this.httpClient.post(
      `${API_ENDPOINTS.USER_PROGRESS.TOP_RANKING}`,
      payload,
    );
    return response;
  }

  public async postUserProgress(
    data: TResult[],
  ): Promise<PostUserProgressResponse> {
    const payload = {
      listUserProgress: data,
    };
    const response: PostUserProgressResponse = await this.httpClient.post(
      `${API_ENDPOINTS.USER_PROGRESS.USER_PROGRESS}`,
      payload,
    );
    return response;
  }

  public async getSettingDevice(
    deviceToken: string,
    childrenId: string,
  ): Promise<UserSettingResponse> {
    const response: UserSettingResponse = await this.httpClient.post(
      `${API_ENDPOINTS.USER_SETTING.GET_SETTING_DEVICE}`,
      {
        deviceToken: deviceToken,
        childrenId,
      },
    );
    return response;
  }

  public async changePointFlowerChild(
    data: ChangeChildPointFlowerPayload,
  ): Promise<ChangeChildPointFlowerResponse> {
    const response: ChangeChildPointFlowerResponse = await this.httpClient.post(
      API_ENDPOINTS.USER.UPDATE_CHILD_POINT,
      data,
    );
    return response;
  }

  public async purchaseModule(
    data: PurchaseModulePayload,
  ): Promise<PurchaseModuleResponse> {
    console.log('purchaseModule data: ', data);
    const response: PurchaseModuleResponse = await this.httpClient.post(
      API_ENDPOINTS.VERIFY_PAYMENT.GOOGLE,
      data,
    );
    console.log('response: ', response);
    return response;
  }
}

export default LessonRepository;
