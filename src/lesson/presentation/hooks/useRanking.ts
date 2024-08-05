import {useEffect, useState} from 'react';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import TopRankingEntity from 'src/lesson/domain/entities/TopRankingEntity';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';

const useRanking = () => {
  const {selectedChild} = useAuthenticationStore();
  const {handleGetRankingOfChild, handleGetTopRanking} = useLessonStore();
  const [rankingOfChild, setRankingOfChild] = useState<number>();
  const [topRanking, setTopRanking] = useState<TopRankingEntity[]>([]);

  useEffect(() => {
    if (selectedChild?._id) {
      handleGetRankingOfChild({userId: selectedChild?._id}).then(v =>
        setRankingOfChild(v.data),
      );
      handleGetTopRanking({limit: 50}).then(v => setTopRanking(v.data));
    }
  }, [handleGetRankingOfChild, handleGetTopRanking, selectedChild?._id]);
  return {rankingOfChild, topRanking};
};

export default useRanking;
