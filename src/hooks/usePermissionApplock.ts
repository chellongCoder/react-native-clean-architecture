import {useState} from 'react';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {isAndroid} from 'src/core/presentation/utils';
import {
  checkOverlayPermission,
  hasUsageStatsPermission,
  checkAndRequestNotificationPermission,
} from 'react-native-alphadex-screentime';

export const usePermissionApplock = () => {
  const [isOverlay, setIsOverlay] = useState<boolean | undefined>();
  const [isUsageStats, setIsUsageStats] = useState<boolean | undefined>();
  const [isPushNoti, setIsPushNoti] = useState<boolean | undefined>();

  useAsyncEffect(async () => {
    if (isAndroid) {
      setIsOverlay(await checkOverlayPermission());

      setIsUsageStats(await hasUsageStatsPermission());

      setIsPushNoti(await checkAndRequestNotificationPermission());
    } else {
      setIsOverlay(true);

      setIsUsageStats(true);

      setIsPushNoti(true);
    }
  }, []);

  return {
    isOverlay,
    isUsageStats,
    isPushNoti,
  };
};
