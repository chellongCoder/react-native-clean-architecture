import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {LessonStoreContext} from './LessonStoreContext';
import {LessonStore} from './LessonStore';
import React from 'react';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import Scoring from 'src/core/presentation/components/Scoring';
import {observer} from 'mobx-react';
import BottomSheetCustom from '../../components/BottomSheet';
import {TouchableOpacity, View} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {Switch} from 'react-native';
import {COLORS} from 'src/core/presentation/constants/colors';
import {
  askOverlayPermission,
  checkOverlayPermission,
  hasUsageStatsPermission,
  startUsageStatsPermission,
  requestPushNotificationPermission,
  checkAndRequestNotificationPermission,
} from 'react-native-alphadex-screentime';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {Image} from 'react-native';

type PropsItemApps = {
  preFixIcon?: React.ReactNode;
  title?: string;
  subTitle?: string;
  active?: boolean;
  onChange?: (a: boolean) => void;
};

type AppItem = {
  title: string;
  subTitle: string;
  preFixIcon: any;
};
export const LessonStoreProvider = observer(({children}: PropsWithChildren) => {
  const value = lessonModuleContainer.getProvided(LessonStore);

  const transformAppEntityToListItem = (appEntity: AppEntity): AppItem => {
    return {
      preFixIcon: <Image src={appEntity.app_icon} width={50} height={50} />,
      subTitle: appEntity.package_name,
      title: appEntity.app_name,
    };
  };

  const listItem = value.listAppsSystem.map(transformAppEntityToListItem);

  return (
    <LessonStoreContext.Provider value={{...value}}>
      {children}
      {value.point.isShow && <Scoring onClose={() => value.setIsShow(false)} />}
      <BottomSheetCustom
        snapPoints={['50']}
        ref={value.bottomSheetAppsRef}
        title="List Apps"
        backgroundColor={COLORS.BACKGROUND}>
        {listItem.map((v, i) => (
          <ItemApps key={i} {...v} />
        ))}
      </BottomSheetCustom>

      <BottomSheetCustom
        snapPoints={['50']}
        ref={value.bottomSheetPermissionRef}
        title="ABC needs system permissions to work with:"
        enablePanDownToClose={false}
        backgroundColor={COLORS.GREEN_66C270}
        enableOverDrag={false}
        onBackdropPress={() => {}}>
        <ItemPermission lesson={value} />
      </BottomSheetCustom>
    </LessonStoreContext.Provider>
  );
});

const ItemApps = ({
  preFixIcon,
  title = '',
  subTitle = '',
  active = false,
  onChange,
}: PropsItemApps) => {
  const globalStyle = useGlobalStyle();

  const [value, setValue] = useState(active);

  useEffect(() => {
    setValue(active);
  }, [active]);

  const onChangeValue = (v: boolean) => {
    onChange ? onChange(v) : setValue(v);
  };

  return (
    <View style={styles.item}>
      {preFixIcon}
      {preFixIcon && <View style={styles.space8} />}
      <View style={styles.fill}>
        <Text style={[globalStyle.txtLabel, styles.txtTitle]}>{title}</Text>
        <Text style={[globalStyle.txtNote, styles.txtSubTitle]}>
          {subTitle}
        </Text>
      </View>
      <Switch
        value={value}
        onChange={e => onChangeValue(e.nativeEvent.value)}
      />
    </View>
  );
};

const ItemPermission = ({lesson}) => {
  const globalStyle = useGlobalStyle();
  const [isOverlay, setIsOverlay] = useState(false);
  const [isUsageStats, setIsUsageStats] = useState(false);
  const [isPushNoti, setIsPushNoti] = useState(false);

  useAsyncEffect(async () => {
    setIsOverlay(await checkOverlayPermission());

    setIsUsageStats(await hasUsageStatsPermission());

    setIsPushNoti(await checkAndRequestNotificationPermission());
  }, []);

  useEffect(() => {
    if (isOverlay && isUsageStats && isPushNoti) {
      setTimeout(() => {
        lesson.onCloseSheetPermission();
      }, 3000);
    }
  }, [isOverlay, isPushNoti, isUsageStats, lesson]);
  return (
    <View style={{height: verticalScale(150), width: '90%'}}>
      <TouchableOpacity
        onPress={() => {
          askOverlayPermission();
        }}
        style={[
          globalStyle.rowCenter,
          globalStyle.spaceBetween,
          styles.permissionItem,
        ]}>
        <Text>System overlay</Text>
        <Text>{isOverlay ? 'checked' : 'unchecked'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          startUsageStatsPermission();
        }}
        style={[
          globalStyle.rowCenter,
          globalStyle.spaceBetween,
          styles.permissionItem,
        ]}>
        <Text>Usage access</Text>
        <Text>{isUsageStats ? 'checked' : 'unchecked'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Push notification');
          requestPushNotificationPermission();
        }}
        style={[
          globalStyle.rowCenter,
          globalStyle.spaceBetween,
          styles.permissionItem,
        ]}>
        <Text>Push notification</Text>
        <Text>{isPushNoti ? 'checked' : 'unchecked'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          lesson.onCloseSheetPermission();
        }}
        style={[
          globalStyle.rowCenter,
          globalStyle.spaceBetween,
          styles.permissionItem,
        ]}>
        <Text>Push notification</Text>
        <Text>{'close'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    width: '95%',
    borderColor: '#AEAEAE',
    borderWidth: 1,
    borderRadius: 8,
  },
  txtTitle: {
    color: 'white',
    fontSize: moderateScale(12),
  },
  txtSubTitle: {
    color: 'white',
    fontSize: moderateScale(10),
  },
  space8: {
    width: 8,
    height: 8,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#AEAEAE',
  },
  permissionItem: {
    borderWidth: 1,
    borderRadius: scale(5),
    padding: scale(8),
    marginBottom: verticalScale(5),
  },
});
