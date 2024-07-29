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
  // const hasLocalData = useMemo(() => {
  //   if(lesson.blockedListAppsSystem.length > 0) {
  //     return true;
  //   } else if(lesson.blockedAnonymousListAppsSystem?.applicationTokens?.length > 0 || lesson.)
  // }, [])
  useEffect(() => {
    lesson.handleGetSettingUser({deviceToken: token, childrenId});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, childrenId]);

  useEffect(() => {
    getStateBlocking();
  }, []);

  useEffect(() => {
    if (lesson.blockedListAppsSystem.length > 0) {
      addToLockedApps(
        lesson.blockedListAppsSystem.map(v => ({
          app_name: v.app_name ?? '',
          package_name: v.package_name ?? '',
          file_path: v.apk_file_path ?? '',
        })),
      );
    }
  }, [lesson.blockedListAppsSystem]);

  return {};
};
