import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import PrimaryButton from '../PrimaryButton';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import IconTickCircle from 'assets/svg/IconTickCircle';
import {observer} from 'mobx-react';
import {LessonStore} from '../../stores/LessonStore/LessonStore';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {
  askOverlayPermission,
  checkAndRequestNotificationPermission,
  checkOverlayPermission,
  hasUsageStatsPermission,
  requestPushNotificationPermission,
  startUsageStatsPermission,
} from 'src/modules/react-native-alphadex-screentime/src';

const ItemPermission = observer(({lesson}: {lesson: LessonStore}) => {
  const globalStyle = useGlobalStyle();
  const timeRef = useRef<NodeJS.Timeout>();
  const {isOverlay, isPushNoti, isUsageStats} = lesson;

  const [errors, setErrors] = useState({isOverlay, isPushNoti, isUsageStats});
  const isConfirm = useMemo(
    () => errors.isOverlay && errors.isPushNoti && errors.isUsageStats,
    [errors.isOverlay, errors.isPushNoti, errors.isUsageStats],
  );

  useEffect(() => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = undefined;
    }
    timeRef.current = setInterval(async () => {
      const overlay = await checkOverlayPermission();
      const usageState = await hasUsageStatsPermission();
      const pushNoti = await checkAndRequestNotificationPermission();

      if (overlay && usageState && pushNoti) {
        lesson.setIsOverlay(overlay);
        lesson.setIsUsageStats(usageState);
        lesson.setIsPushNoti(pushNoti);
        clearInterval(timeRef.current);
        return;
      }
      if (lesson.isOverlay !== overlay) {
        lesson.setIsOverlay(overlay);
      }
      if (lesson.isUsageStats !== overlay) {
        lesson.setIsUsageStats(usageState);
      }
      if (lesson.isPushNoti !== overlay) {
        lesson.setIsPushNoti(pushNoti);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    setErrors({isOverlay, isPushNoti, isUsageStats});
  }, [isOverlay, isPushNoti, isUsageStats]);

  return (
    <View style={{width: '90%', alignSelf: 'center'}}>
      <>
        <TouchableOpacity
          onPress={() => {
            askOverlayPermission();
          }}
          style={[
            globalStyle.rowCenter,
            globalStyle.spaceBetween,
            styles.permissionItem,
            !errors.isOverlay && {borderColor: COLORS.ERROR},
            !errors.isOverlay && {backgroundColor: COLORS.WHITE_FBF8CC},
          ]}>
          <Text>System overlay</Text>
          <View>
            <IconTickCircle
              isTick={isOverlay}
              width={scale(20)}
              height={scale(20)}
            />
          </View>
        </TouchableOpacity>
        <Text style={[globalStyle.txtNote, {marginVertical: verticalScale(5)}]}>
          This permission allows an app to lock other apps you're using. This
          may interfere with your use of other apps
        </Text>
      </>
      <>
        <TouchableOpacity
          onPress={() => {
            startUsageStatsPermission();
          }}
          style={[
            globalStyle.rowCenter,
            globalStyle.spaceBetween,
            styles.permissionItem,
            !errors.isUsageStats && {borderColor: COLORS.ERROR},
            !errors.isUsageStats && {backgroundColor: COLORS.WHITE_FBF8CC},
          ]}>
          <Text>Usage access</Text>
          <View>
            <IconTickCircle
              isTick={isUsageStats}
              width={scale(20)}
              height={scale(20)}
            />
          </View>
        </TouchableOpacity>
        <Text style={[globalStyle.txtNote, {marginVertical: verticalScale(5)}]}>
          Allow app to monitor which other apps you use and how often and
          identify your service provider, language settings, and other usage
          data.
        </Text>
      </>
      <>
        <TouchableOpacity
          onPress={() => {
            console.log('Push notification');
            requestPushNotificationPermission();
          }}
          style={[
            globalStyle.rowCenter,
            globalStyle.spaceBetween,
            styles.permissionItem,
            !errors.isPushNoti && {borderColor: COLORS.ERROR},
            !errors.isPushNoti && {backgroundColor: COLORS.WHITE_FBF8CC},
          ]}>
          <Text>Push notification</Text>
          <View>
            <IconTickCircle
              isTick={isPushNoti}
              width={scale(20)}
              height={scale(20)}
            />
          </View>
        </TouchableOpacity>
      </>

      <View style={{alignItems: 'center', paddingVertical: verticalScale(20)}}>
        <PrimaryButton
          onPress={() => {
            clearInterval(timeRef.current);
            lesson.onCloseSheetPermission();
          }}
          text="Confirm"
          style={{
            borderRadius: scale(24),
            paddingVertical: verticalScale(12),
            marginTop: verticalScale(8),
            backgroundColor: isConfirm
              ? COLORS.GREEN_DDF598
              : COLORS.WHITE_FBF8CC,
          }}
          textStyle={{color: COLORS.GREEN_1C6349}}
        />
      </View>
    </View>
  );
});

export default ItemPermission;

const styles = StyleSheet.create({
  permissionItem: {
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(5),
    backgroundColor: COLORS.GREEN_DDF598,
  },
});
