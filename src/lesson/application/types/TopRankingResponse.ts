import TopRankingEntity from 'src/lesson/domain/entities/TopRankingEntity';

export default interface RankingOfChildResponse {
  message: string;
  data: TopRankingEntity[];
}
