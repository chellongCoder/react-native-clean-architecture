import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
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
import {useAnimatedShake} from 'src/hooks/useAnimatedShake';
import Animated from 'react-native-reanimated';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
type Props = {
  appName: string;
  error?: string;
  childrenId: string;
  onBlocked?: () => void;
};
const SelectApp = ({appName, error, childrenId, onBlocked}: Props) => {
  const lesson = useLessonStore();
  const globalStyle = useGlobalStyle();
  const {shake, rStyle} = useAnimatedShake();
  const shakeRef = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    if (error !== '') {
      shakeRef.current = setInterval(() => {
        shake();
      }, 1500);

      return () => {
        clearInterval(shakeRef.current);
      };
    }
  }, [error, shake]);

  return (
    <Animated.View style={[rStyle]}>
      {isAndroid ? (
        <TouchableOpacity
          onPress={async () => {
            await lesson.changeListAppSystem();
            lesson.onShowSheetApps();
          }}
          style={[
            styles.card,
            error ? {borderColor: 'red', borderWidth: 1} : {},
          ]}>
          <Text style={[globalStyle.txtButton, styles.textCard]}>
            {appName.trim() !== '' ? appName : 'select apps'}
          </Text>
          <IconArrowDown />
        </TouchableOpacity>
      ) : (
        <>
          <ScreenTimeComponent
            onChangeBlock={e => {
              const blockedApps: FamilyActivitySelection = JSON.parse(
                e.nativeEvent.blockedApps,
              );

              lesson.changeBlockedAnonymousListAppSystem(blockedApps);
              onBlocked?.();
            }}
            childrenId={childrenId}
            style={[
              styles.container,
              error ? {borderColor: COLORS.ERROR, borderWidth: 1} : {},
            ]}>
            <Text style={[globalStyle.txtButton, styles.textCard]}>
              {appName.trim() !== '' ? appName : 'select apps'}
            </Text>
            <IconArrowDown />
          </ScreenTimeComponent>
          {error ? (
            <View style={{marginRight: 20, marginVertical: 5}}>
              <Text
                style={[
                  globalStyle.txtNote,
                  {
                    textAlign: 'left',
                    color: COLORS.ERROR,
                    lineHeight: verticalScale(10),
                  },
                ]}>
                {error}
              </Text>
            </View>
          ) : (
            <View style={{height: verticalScale(12)}} />
          )}
        </>
      )}
    </Animated.View>
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
    // marginBottom: verticalScale(12),
    paddingHorizontal: scale(10),
  },
  textCard: {
    color: '#1C6349',
    marginRight: 4,
  },
});
