import {
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CommonInputPassword} from 'src/authentication/presentation/components/CommonInput';
import {assets} from 'src/core/presentation/utils';
import {scale} from 'react-native-size-matters';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {COLORS} from 'src/core/presentation/constants/colors';
import {useAnimatedShake} from 'src/hooks/useAnimatedShake';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {usePermissionApplock} from 'src/hooks/usePermissionApplock';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import PrimaryButton from 'src/lesson/presentation/components/PrimaryButton';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';

const ChangePasswordScreen = () => {
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');
  const [error, setError] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');
  usePermissionApplock();
  const {handleUpdatePassword} = useLoginWithCredentials();
  const {shake, rStyle} = useAnimatedShake();
  // const lessonStore = useLessonStore();
  const loadingGlobal = useLoadingGlobal();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const onSubmit = async () => {
    if (passwordRef.current !== confirmPasswordRef.current) {
      setErrorConfirm('Confirm password not match!');
      return;
    } else {
      setErrorConfirm('');
    }
    loadingGlobal.show?.();
    const res = await handleUpdatePassword({newPassword: passwordRef.current});
    if (res === 200) {
      // lessonStore.setPasswordParent(passwordRef.current);
      goBack();
    } else {
      shake();
      setError('Password not match!');
    }
    loadingGlobal.hide?.();
  };

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, {duration: 500});
      translateY.value = withSpring(0, {damping: 10, stiffness: 100});
    }, 300);
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <ImageBackground
      style={[styles.container]}
      source={assets.bee_bg}
      imageStyle={styles.imageStyle}
      resizeMode="cover">
      <ScrollView>
        <Animated.View style={[rStyle, animatedStyle]}>
          <Text style={[styles.title]}>Update password</Text>
          <CommonInputPassword
            label="Enter password"
            textInputProp={{
              onChangeText: p => (passwordRef.current = p),
            }}
            autofocus
            suffiex={error && <Text style={styles.errorMsg}>*{error}</Text>}
          />

          <CommonInputPassword
            label="Confirm password"
            textInputProp={{
              onChangeText: p => (confirmPasswordRef.current = p),
            }}
            suffiex={
              errorConfirm && (
                <Text style={styles.errorMsg}>*{errorConfirm}</Text>
              )
            }
          />

          <PrimaryButton
            text="Enter"
            style={styles.btnEnter}
            onPress={onSubmit}
            textStyle={{fontSize: 20}}
          />
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8cc',
    paddingHorizontal: 30,
    paddingVertical: 40,
    paddingTop: 200,
  },
  imageStyle: {opacity: 0.3},
  title: {
    ...CustomTextStyle.h2,
    marginBottom: 32,
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
