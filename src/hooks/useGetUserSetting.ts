import {useEffect} from 'react';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';

export const useGetUserSetting = (
  token: string,
  childrenId: string,
  lesson: LessonStore,
) => {
  useEffect(() => {
    lesson.handleGetSettingUser({deviceToken: token, childrenId});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
};
