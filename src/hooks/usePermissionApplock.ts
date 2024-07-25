import {useEffect, useRef, useState} from 'react';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {isAndroid} from 'src/core/presentation/utils';
import {
  checkOverlayPermission,
  hasUsageStatsPermission,
  checkAndRequestNotificationPermission,
} from 'react-native-alphadex-screentime';
import {AppState, AppStateStatus} from 'react-native';

export const usePermissionApplock = (isInterval = false) => {
  const [isOverlay, setIsOverlay] = useState<boolean | undefined>();
  const [isUsageStats, setIsUsageStats] = useState<boolean | undefined>();
  const [isPushNoti, setIsPushNoti] = useState<boolean | undefined>();
  const timeRef = useRef<NodeJS.Timeout>(null);

  useAsyncEffect(async () => {
    if (isAndroid) {
      if (isInterval) {
        timeRef.current = setInterval(async () => {
          setIsOverlay(await checkOverlayPermission());
          setIsUsageStats(await hasUsageStatsPermission());
          setIsPushNoti(await checkAndRequestNotificationPermission());
        }, 1000);
      } else {
        setIsOverlay(await checkOverlayPermission());
        setIsUsageStats(await hasUsageStatsPermission());
        setIsPushNoti(await checkAndRequestNotificationPermission());
      }
    } else {
      setIsOverlay(true);

      setIsUsageStats(true);

      setIsPushNoti(true);
    }

    return () => {
      clearInterval(timeRef.current);
    };
  }, []);

  return {
    isOverlay,
    isUsageStats,
    isPushNoti,
  };
};
