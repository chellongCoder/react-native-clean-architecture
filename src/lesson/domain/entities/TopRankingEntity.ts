import {children} from 'src/authentication/application/types/GetUserProfileResponse';

export default interface TopRankingEntity {
  _id: string;
  user: Pick<children, '_id' | 'name' | 'parentId'>;
  totalPoint: number;
}
