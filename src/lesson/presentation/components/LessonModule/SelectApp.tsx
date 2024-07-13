import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconArrowDown from 'assets/svg/IconArrowDown';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  FamilyActivitySelection,
  ScreenTimeComponent,
} from 'react-native-alphadex-screentime';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from '../../stores/LessonStore/LessonStore';
import {isAndroid} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
type Props = {
  appName: string;
};
const SelectApp = ({appName}: Props) => {
  const lesson = lessonModuleContainer.getProvided(LessonStore);
  const globalStyle = useGlobalStyle();
  return (
    <>
      {isAndroid ? (
        <TouchableOpacity
          onPress={async () => {
            await lesson.changeListAppSystem();
            lesson.onShowSheetApps();
          }}
          style={[styles.card]}>
          <Text style={[globalStyle.txtButton, styles.textCard]}>
            {appName.trim() !== '' ? appName : 'select apps'}
          </Text>
          <IconArrowDown />
        </TouchableOpacity>
      ) : (
        <ScreenTimeComponent
          onChangeBlock={e => {
            const blockedApps: FamilyActivitySelection = JSON.parse(
              e.nativeEvent.blockedApps,
            );
            lesson.changeBlockedAnonymousListAppSystem(blockedApps);
          }}
          style={styles.container}>
          <Text style={[globalStyle.txtButton, styles.textCard]}>
            {appName.trim() !== '' ? appName : 'select apps'}
          </Text>
          <IconArrowDown />
        </ScreenTimeComponent>
      )}
    </>
  );
};

export default SelectApp;

const styles = StyleSheet.create({
  card: {
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    paddingHorizontal: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE699',
    alignSelf: 'flex-start',
    marginRight: scale(8),
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
  },
  container: {
    width: scale(95.29),
    height: verticalScale(30.8),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: scale(20),
    backgroundColor: '#FFE699',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(10),
  },
  textCard: {
    color: '#1C6349',
    marginRight: 4,
  },
});
