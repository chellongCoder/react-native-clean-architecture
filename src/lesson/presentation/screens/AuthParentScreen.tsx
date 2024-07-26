import {ScrollView, StyleSheet, View, Text, Keyboard} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CommonInputPassword} from 'src/authentication/presentation/components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {replaceScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import {isAndroid} from 'src/core/presentation/utils';
import {scale} from 'react-native-size-matters';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {COLORS} from 'src/core/presentation/constants/colors';
import {useAnimatedShake} from 'src/hooks/useAnimatedShake';
import Animated from 'react-native-reanimated';
import {usePermissionApplock} from 'src/hooks/usePermissionApplock';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {AppState, AppStateStatus} from 'react-native';

const AuthParentScreen = () => {
  // const [password, setPassword] = useState('');
  const passwordRef = useRef('');
  const [error, setError] = useState('');
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const appStateRef = useRef<AppStateStatus>('unknown');

  const {handleComparePassword} = useLoginWithCredentials();
  const {shake, rStyle} = useAnimatedShake();
  const lessonStore = useLessonStore();
  const loadingGlobal = useLoadingGlobal();
  const permissionHook = usePermissionApplock();

  const onSubmit = async () => {
    loadingGlobal.show?.();
    const res = await handleComparePassword({password: passwordRef.current});
    if (res === 200) {
      lessonStore.setPasswordParent(passwordRef.current);
      replaceScreen(STACK_NAVIGATOR.PARENT.PARENT_SCREEN);
    } else {
      shake();
      setError('Password not match!');
    }
    loadingGlobal.hide?.();
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // Perform any actions needed when the app comes to the foreground
        // setAppState(nextAppState);
      } else {
        // setAppState(nextAppState);
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <ScrollView>
        <Animated.View style={[rStyle]}>
          <CommonInputPassword
            label="Enter password"
            textInputProp={{
              onChangeText: p => (passwordRef.current = p),
            }}
            autofocus
            suffiex={error && <Text style={styles.errorMsg}>*{error}</Text>}
          />

          <PrimaryButton
            text="Enter"
            style={styles.btnEnter}
            onPress={onSubmit}
            textStyle={{fontSize: 20}}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default withProviders(LessonStoreProvider)(AuthParentScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8cc',
    paddingHorizontal: 30,
    paddingVertical: 40,
    paddingTop: 200,
  },
  btnEnter: {
    marginTop: 70,
    paddingVertical: scale(12),
  },
  errorMsg: {
    ...CustomTextStyle.body2,
    color: COLORS.ERROR,
  },
});
