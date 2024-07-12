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
    console.log(
      '🛠 LOG: 🚀 --> --------------------------------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log(
      '🛠 LOG: 🚀 --> ~ LessonRepository ~ updateBlockedApp ~ response:',
      response,
    );
    console.log(
      '🛠 LOG: 🚀 --> --------------------------------------------------------------------------🛠 LOG: 🚀 -->',
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
}

export default LessonRepository;
