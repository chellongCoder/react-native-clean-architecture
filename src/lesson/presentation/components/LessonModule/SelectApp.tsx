import {StyleSheet, Text} from 'react-native';
import React from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import IconArrowDown from 'assets/svg/IconArrowDown';
import {scale, verticalScale} from 'react-native-size-matters';
import {ScreenTimeComponent} from 'src/modules/react-native-alphadex-screentime/src';
import {COLORS} from 'src/core/presentation/utils/colors';
type Props = {
  appName: string;
};
const SelectApp = ({appName}: Props) => {
  const lesson = useLessonStore();
  const globalStyle = useGlobalStyle();

  return (
    <>
      <ScreenTimeComponent
        onChangeBlock={e => {
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------🛠 LOG: 🚀 -->',
          );
          console.log('🛠 LOG: 🚀 --> ~ ModuleItem ~ e:', e);
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------🛠 LOG: 🚀 -->',
          );
          //   navigateScreen(STACK_NAVIGATOR.HOME.LESSON);
        }}
        style={styles.container}>
        <Text style={[globalStyle.txtButton, styles.textCard]}>
          {appName.trim() !== '' ? appName : 'select apps'}
        </Text>
        <IconArrowDown />
      </ScreenTimeComponent>
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
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: scale(20),
    backgroundColor: '#FFE699',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
  },
  textCard: {
    color: '#1C6349',
    marginRight: 4,
  },
});
