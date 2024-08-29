import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
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
  startUsageStatsPermission,
  requestPushNotificationPermission,
  addToLockedApps,
  checkOverlayPermission,
  hasUsageStatsPermission,
  checkAndRequestNotificationPermission,
} from 'react-native-alphadex-screentime';
import {AppEntity} from 'src/modules/react-native-alphadex-screentime/src/entities/AppEntity';
import {Image} from 'react-native';
import Button from '../../components/LessonModule/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import ICCheckbox from 'src/core/components/icons/ICCheckbox';
import PrimaryButton from '../../components/PrimaryButton';
import IconTickCircle from 'assets/svg/IconTickCircle';
import {isAndroid} from 'src/core/presentation/utils';

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
  const {isOverlay, isPushNoti, isUsageStats} = value;

  const isConfirm = useMemo(
    () => isOverlay && isPushNoti && isUsageStats,
    [isOverlay, isPushNoti, isUsageStats],
  );
  // const renderBottomSheet = useCallback(() => {
  //   return (
  //     <>
  //       {value.bottomSheetAppsRef && (
  //         <BottomSheetCustom
  //           snapPoints={['50']}
  //           ref={value.bottomSheetAppsRef}
  //           title="List Apps"
  //           backgroundColor={COLORS.BACKGROUND}
  //           onDone={() => {
  //             value.onCloseSheetApps();
  //             value.changeBlockedListAppSystem(apps);
  //           }}>
  //           {listItem.map((v, i) => {
  //             const blockedApps = value.blockedListAppsSystem;
  //             const blockedApp = blockedApps.find(
  //               app => app.package_name === v.subTitle,
  //             );
  //             return (
  //               <ItemApps
  //                 onChange={(id, s) => {
  //                   setApps(prev => {
  //                     if (s) {
  //                       const app = value.listAppsSystem.find(
  //                         e => e.package_name === id,
  //                       );
  //                       return [...prev, app!];
  //                     } else {
  //                       const selectedApps = prev.filter(
  //                         e => e.package_name !== id,
  //                       );
  //                       return selectedApps;
  //                     }
  //                   });
  //                 }}
  //                 key={i}
  //                 {...v}
  //                 active={!!blockedApp}
  //               />
  //             );
  //           })}
  //         </BottomSheetCustom>
  //       )}

  //       {!isConfirm && value.bottomSheetPermissionRef && (
  //         <BottomSheetCustom
  //           snapPoints={['70']}
  //           ref={value.bottomSheetPermissionRef}
  //           title="ABeeCi needs system permissions to work with:"
  //           enablePanDownToClose={false}
  //           backgroundColor={COLORS.GREEN_66C270}
  //           enableOverDrag={false}
  //           onBackdropPress={() => {}}>
  //           <ItemPermission lesson={value} />
  //         </BottomSheetCustom>
  //       )}
  //     </>
  //   );
  // }, [apps, isConfirm, listItem, value]);

  return (
    <LessonStoreContext.Provider value={value}>
      {children}
      {value.point.isShow && <Scoring onClose={() => value.setIsShow(false)} />}
      {/* {isAndroid && renderBottomSheet()} */}
    </LessonStoreContext.Provider>
  );
});

// const ItemApps = ({
//   preFixIcon,
//   title = '',
//   subTitle = '',
//   active = false,
//   onChange,
//   apkFilePath,
// }: PropsItemApps & AppItem) => {
//   const globalStyle = useGlobalStyle();

//   const [value, setValue] = useState(active);

//   useEffect(() => {
//     setValue(active);
//   }, [active]);

//   const onChangeValue = (v: boolean) => {
//     setValue(v);
//     if (v) {
//       onChange?.(subTitle, v);
//     } else {
//       onChange?.(subTitle, v);
//     }
//   };

//   return (
//     <View style={styles.item}>
//       {preFixIcon}
//       {preFixIcon && <View style={styles.space8} />}
//       <View style={styles.fill}>
//         <Text style={[globalStyle.txtLabel, styles.txtTitle]}>{title}</Text>
//         <Text style={[globalStyle.txtNote, styles.txtSubTitle]}>
//           {subTitle}
//         </Text>
//       </View>
//       <Switch
//         value={value}
//         onChange={e => {
//           onChangeValue(e.nativeEvent.value);
//         }}
//       />
//     </View>
//   );
// };

// const ItemPermission = observer(({lesson}: {lesson: LessonStore}) => {
//   const globalStyle = useGlobalStyle();
//   const timeRef = useRef<NodeJS.Timeout>();
//   const {isOverlay, isPushNoti, isUsageStats} = lesson;

//   const [errors, setErrors] = useState({isOverlay, isPushNoti, isUsageStats});
//   const isConfirm = useMemo(
//     () => errors.isOverlay && errors.isPushNoti && errors.isUsageStats,
//     [errors.isOverlay, errors.isPushNoti, errors.isUsageStats],
//   );

//   useEffect(() => {
//     if (timeRef.current) {
//       clearInterval(timeRef.current);
//       timeRef.current = undefined;
//     }
//     timeRef.current = setInterval(async () => {
//       const overlay = await checkOverlayPermission();
//       const usageState = await hasUsageStatsPermission();
//       const pushNoti = await checkAndRequestNotificationPermission();

//       if (overlay && usageState && pushNoti) {
//         lesson.setIsOverlay(overlay);
//         lesson.setIsUsageStats(usageState);
//         lesson.setIsPushNoti(pushNoti);
//         clearInterval(timeRef.current);
//         return;
//       }
//       if (lesson.isOverlay !== overlay) {
//         lesson.setIsOverlay(overlay);
//       }
//       if (lesson.isUsageStats !== overlay) {
//         lesson.setIsUsageStats(usageState);
//       }
//       if (lesson.isPushNoti !== overlay) {
//         lesson.setIsPushNoti(pushNoti);
//       }
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     setErrors({isOverlay, isPushNoti, isUsageStats});
//   }, [isOverlay, isPushNoti, isUsageStats]);

//   return (
//     <View style={{width: '90%', alignSelf: 'center'}}>
//       <>
//         <TouchableOpacity
//           onPress={() => {
//             askOverlayPermission();
//           }}
//           style={[
//             globalStyle.rowCenter,
//             globalStyle.spaceBetween,
//             styles.permissionItem,
//             !errors.isOverlay && {borderColor: COLORS.ERROR},
//             !errors.isOverlay && {backgroundColor: COLORS.WHITE_FBF8CC},
//           ]}>
//           <Text>System overlay</Text>
//           <View>
//             <IconTickCircle
//               isTick={isOverlay}
//               width={scale(20)}
//               height={scale(20)}
//             />
//           </View>
//         </TouchableOpacity>
//         <Text style={[globalStyle.txtNote, {marginVertical: verticalScale(5)}]}>
//           This permission allows an app to lock other apps you're using. This
//           may interfere with your use of other apps
//         </Text>
//       </>
//       <>
//         <TouchableOpacity
//           onPress={() => {
//             startUsageStatsPermission();
//           }}
//           style={[
//             globalStyle.rowCenter,
//             globalStyle.spaceBetween,
//             styles.permissionItem,
//             !errors.isUsageStats && {borderColor: COLORS.ERROR},
//             !errors.isUsageStats && {backgroundColor: COLORS.WHITE_FBF8CC},
//           ]}>
//           <Text>Usage access</Text>
//           <View>
//             <IconTickCircle
//               isTick={isUsageStats}
//               width={scale(20)}
//               height={scale(20)}
//             />
//           </View>
//         </TouchableOpacity>
//         <Text style={[globalStyle.txtNote, {marginVertical: verticalScale(5)}]}>
//           Allow app to monitor which other apps you use and how often and
//           identify your service provider, language settings, and other usage
//           data.
//         </Text>
//       </>
//       <>
//         <TouchableOpacity
//           onPress={() => {
//             console.log('Push notification');
//             requestPushNotificationPermission();
//           }}
//           style={[
//             globalStyle.rowCenter,
//             globalStyle.spaceBetween,
//             styles.permissionItem,
//             !errors.isPushNoti && {borderColor: COLORS.ERROR},
//             !errors.isPushNoti && {backgroundColor: COLORS.WHITE_FBF8CC},
//           ]}>
//           <Text>Push notification</Text>
//           <View>
//             <IconTickCircle
//               isTick={isPushNoti}
//               width={scale(20)}
//               height={scale(20)}
//             />
//           </View>
//         </TouchableOpacity>
//       </>

//       <View style={{alignItems: 'center', paddingVertical: verticalScale(20)}}>
//         <PrimaryButton
//           onPress={() => {
//             clearInterval(timeRef.current);
//             lesson.onCloseSheetPermission();
//           }}
//           text="Confirm"
//           style={{
//             borderRadius: scale(24),
//             paddingVertical: verticalScale(12),
//             marginTop: verticalScale(8),
//             backgroundColor: isConfirm
//               ? COLORS.GREEN_DDF598
//               : COLORS.WHITE_FBF8CC,
//           }}
//           textStyle={{color: COLORS.GREEN_1C6349}}
//         />
//       </View>
//     </View>
//   );
// });

// const styles = StyleSheet.create({
//   fill: {
//     flex: 1,
//   },
//   justifyContentCenter: {
//     justifyContent: 'center',
//   },
//   item: {
//     flexDirection: 'row',
//     padding: 8,
//     marginHorizontal: 8,
//     marginBottom: 8,
//     width: '95%',
//     borderColor: '#AEAEAE',
//     borderWidth: 1,
//     borderRadius: 8,
//   },
//   txtTitle: {
//     color: 'white',
//     fontSize: moderateScale(12),
//   },
//   txtSubTitle: {
//     color: 'white',
//     fontSize: moderateScale(10),
//   },
//   space8: {
//     width: 8,
//     height: 8,
//   },
//   iconBox: {
//     width: 36,
//     height: 36,
//     borderRadius: 36,
//     overflow: 'hidden',
//     backgroundColor: '#AEAEAE',
//   },
//   permissionItem: {
//     borderRadius: scale(12),
//     paddingHorizontal: scale(16),
//     paddingVertical: verticalScale(12),
//     marginTop: verticalScale(5),
//     backgroundColor: COLORS.GREEN_DDF598,
//   },
// });
