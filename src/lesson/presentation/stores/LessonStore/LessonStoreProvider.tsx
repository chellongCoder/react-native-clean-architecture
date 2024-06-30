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
  addToLockedApps,
} from 'react-native-alphadex-screentime';
import {useAsyncEffect} from 'src/core/presentation/hooks';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {Image} from 'react-native';
import Button from '../../components/LessonModule/Button';
import {useNavigation, useRoute} from '@react-navigation/native';

type PropsItemApps = {
  preFixIcon?: React.ReactNode;
  title?: string;
  subTitle?: string;
  active?: boolean;
  onChange?: (id: string, status: boolean) => void;
};

type AppItem = {
  title: string;
  subTitle: string;
  preFixIcon: any;
  apkFilePath: string;
};
export const LessonStoreProvider = observer(({children}: PropsWithChildren) => {
  const value = lessonModuleContainer.getProvided(LessonStore);
  const [apps, setApps] = useState<AppEntity[]>([]);
  const [isShowBottomSheet, setIsShowBottomSheet] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  const transformAppEntityToListItem = (appEntity: AppEntity): AppItem => {
    return {
      preFixIcon: (
        <Image
          source={{uri: `data:image/jpg;base64,${appEntity.app_icon}`}}
          width={50}
          height={50}
        />
      ),

      subTitle: appEntity.package_name,
      title: appEntity.app_name,
      apkFilePath: appEntity.apk_file_path,
    };
  };

  const listItem = value.listAppsSystem.map(transformAppEntityToListItem);

  useEffect(() => {
    if (route.name === 'LESSON_SCREEN') {
      setIsShowBottomSheet(false);
    } else {
      setIsShowBottomSheet(true);
    }
  }, [route.name]);

  const renderBottomSheet = useCallback(() => {
    return (
      <>
        {value.bottomSheetAppsRef && (
          <BottomSheetCustom
            snapPoints={['50']}
            ref={value.bottomSheetAppsRef}
            title="List Apps"
            backgroundColor={COLORS.BACKGROUND}
            onDone={() => {
              value.onCloseSheetApps();
              value.changeBlockedListAppSystem(apps);
              addToLockedApps(
                apps.map(v => ({
                  app_name: v.app_name,
                  package_name: v.package_name,
                  file_path: v.apk_file_path,
                })),
              );
            }}>
            {listItem.map((v, i) => (
              <ItemApps
                onChange={(id, s) => {
                  setApps(prev => {
                    if (s) {
                      const app = value.listAppsSystem.find(
                        e => e.package_name === id,
                      );
                      return [...prev, app!];
                    } else {
                      const selectedApps = prev.filter(
                        e => e.package_name !== id,
                      );
                      return selectedApps;
                    }
                  });
                }}
                key={i}
                {...v}
              />
            ))}
          </BottomSheetCustom>
        )}

        {value.bottomSheetPermissionRef && (
          <BottomSheetCustom
            snapPoints={['50']}
            index={-1}
            ref={value.bottomSheetPermissionRef}
            title="ABC needs system permissions to work with:"
            enablePanDownToClose={false}
            backgroundColor={COLORS.GREEN_66C270}
            enableOverDrag={false}
            onBackdropPress={() => {}}>
            <ItemPermission lesson={value} />
          </BottomSheetCustom>
        )}
      </>
    );
  }, [apps, listItem, value]);
  return (
    <LessonStoreContext.Provider value={{...value}}>
      {children}
      {value.point.isShow && <Scoring onClose={() => value.setIsShow(false)} />}
      {isShowBottomSheet && renderBottomSheet()}
    </LessonStoreContext.Provider>
  );
});

const ItemApps = ({
  preFixIcon,
  title = '',
  subTitle = '',
  active = false,
  onChange,
  apkFilePath,
}: PropsItemApps & AppItem) => {
  const globalStyle = useGlobalStyle();

  const [value, setValue] = useState(active);

  useEffect(() => {
    setValue(active);
  }, [active]);

  const onChangeValue = (v: boolean) => {
    setValue(v);
    if (v) {
      onChange?.(subTitle, v);
    } else {
      onChange?.(subTitle, v);
    }
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
        onChange={e => {
          onChangeValue(e.nativeEvent.value);
        }}
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
      }, 2000);
    }
  }, [isOverlay, isPushNoti, isUsageStats, lesson]);
  return (
    <View style={{width: '90%', alignSelf: 'center'}}>
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

      <View style={{alignItems: 'center', paddingVertical: verticalScale(20)}}>
        <Button
          onPress={() => {
            lesson.onCloseSheetPermission();
          }}
          title="confirm"
          color={COLORS.YELLOW_E6960B}
        />
      </View>
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
