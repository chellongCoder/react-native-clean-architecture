import {useEffect, useMemo} from 'react';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';
import {
  addToLockedApps,
  getStateBlocking,
} from 'react-native-alphadex-screentime';

export const useGetUserSetting = (
  token: string,
  childrenId: string,
  lesson: LessonStore,
) => {
  useEffect(() => {
    lesson.handleGetSettingUser({deviceToken: token, childrenId});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, childrenId]);

  useEffect(() => {
    getStateBlocking();
  }, []);

  return {};
};
