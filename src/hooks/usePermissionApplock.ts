import {useEffect, useRef, useState} from 'react';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {isAndroid} from 'src/core/presentation/utils';
import {
  checkOverlayPermission,
  hasUsageStatsPermission,
  checkAndRequestNotificationPermission,
} from 'react-native-alphadex-screentime';
import {AppState, AppStateStatus, Keyboard} from 'react-native';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';

export const usePermissionApplock = () => {
  const lessonStore = lessonModuleContainer.getProvided(LessonStore);

  useAsyncEffect(async () => {
    if (isAndroid) {
      const isOverlayPermission = await checkOverlayPermission();
      const isUsageStatsPermission = await hasUsageStatsPermission();
      const isPushNotiPermission =
        await checkAndRequestNotificationPermission();

      if (
        isOverlayPermission &&
        isPushNotiPermission &&
        isUsageStatsPermission
      ) {
        return;
      }

      lessonStore.setIsOverlay(await checkOverlayPermission());
      lessonStore.setIsUsageStats(await hasUsageStatsPermission());
      lessonStore.setIsPushNoti(await checkAndRequestNotificationPermission());

      Keyboard.dismiss();
      setTimeout(() => {
        lessonStore.onShowSheetPermission();
      }, 1000);
    } else {
      lessonStore.setIsOverlay(true);

      lessonStore.setIsUsageStats(true);

      lessonStore.setIsPushNoti(true);
    }
  }, [lessonStore]);

  return {
    isOverlay: lessonStore.isOverlay,
    isUsageStats: lessonStore.isUsageStats,
    isPushNoti: lessonStore.isPushNoti,
  };
};
