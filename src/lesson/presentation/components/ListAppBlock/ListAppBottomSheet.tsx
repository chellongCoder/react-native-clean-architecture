import {Image} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import BottomSheetCustom from '../BottomSheet';
import {AppEntity} from 'src/lesson/domain/entities/AppEntity';
import {COLORS} from 'src/core/presentation/constants/colors';
import ItemApps, {AppItem} from './ItemApps';
import ItemPermission from './ItemPermission';

const ListAppBottomSheet = () => {
  const lesson = useLessonStore();
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

  const listItem = lesson.listAppsSystem.map(transformAppEntityToListItem);

  const {isOverlay, isPushNoti, isUsageStats} = lesson;

  const isConfirm = useMemo(
    () => isOverlay && isPushNoti && isUsageStats,
    [isOverlay, isPushNoti, isUsageStats],
  );
  return (
    <>
      {lesson.bottomSheetAppsRef && (
        <BottomSheetCustom
          snapPoints={['50']}
          ref={lesson.bottomSheetAppsRef}
          title="List Apps"
          backgroundColor={COLORS.BACKGROUND}
          onDone={() => {
            lesson.onCloseSheetApps();
            lesson.changeBlockedListAppSystem(apps);
          }}>
          {listItem.map((v, i) => {
            const blockedApps = lesson.blockedListAppsSystem;
            const blockedApp = blockedApps.find(
              app => app.package_name === v.subTitle,
            );
            return (
              <ItemApps
                onChange={(id, s) => {
                  setApps(prev => {
                    if (s) {
                      const app = lesson.listAppsSystem.find(
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
                active={!!blockedApp}
              />
            );
          })}
        </BottomSheetCustom>
      )}

      {!isConfirm && lesson.bottomSheetPermissionRef && (
        <BottomSheetCustom
          snapPoints={['70']}
          ref={lesson.bottomSheetPermissionRef}
          title="ABeeCi needs system permissions to work with:"
          enablePanDownToClose={false}
          backgroundColor={COLORS.GREEN_66C270}
          enableOverDrag={false}
          onBackdropPress={() => {
            //
          }}>
          <ItemPermission lesson={lesson} />
        </BottomSheetCustom>
      )}
    </>
  );
};

export default ListAppBottomSheet;
