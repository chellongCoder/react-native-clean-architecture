import {useEffect} from 'react';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';

export const useGetUserSetting = (token: string, lesson: LessonStore) => {
  useEffect(() => {
    lesson.handleGetSettingUser(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
};
