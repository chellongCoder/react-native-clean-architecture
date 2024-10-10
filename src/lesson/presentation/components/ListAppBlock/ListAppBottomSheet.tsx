import {FlatList, Image} from 'react-native';
import React, {memo, useMemo, useState} from 'react';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {observer} from 'mobx-react';
import BottomSheetCustom from '../BottomSheet';
import {AppEntity} from 'src/lesson/domain/entities/AppEntity';
import {COLORS} from 'src/core/presentation/constants/colors';
import ItemApps, {AppItem} from './ItemApps';

const ListAppBottomSheet = observer(() => {
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

  const listItem = useMemo(
    () => lesson.listAppsSystem.map(transformAppEntityToListItem),
    [lesson.listAppsSystem],
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
          <FlatList
            data={listItem}
            renderItem={({item}) => {
              const blockedApps = lesson.blockedListAppsSystem;
              const blockedApp = blockedApps.find(
                app => app.package_name === item.subTitle,
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
                  {...item}
                  active={!!blockedApp}
                />
              );
            }}
            keyExtractor={(_, i) => i.toString()}
          />
        </BottomSheetCustom>
      )}
    </>
  );
});

export default memo(ListAppBottomSheet);
