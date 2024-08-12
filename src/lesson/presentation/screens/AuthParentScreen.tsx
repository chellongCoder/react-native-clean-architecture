import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Keyboard,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CommonInputPassword} from 'src/authentication/presentation/components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import {assets, isAndroid} from 'src/core/presentation/utils';
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

const AuthParentScreen = ({changeIsShowAuth}) => {
  // const [password, setPassword] = useState('');
  const passwordRef = useRef('');
  const [error, setError] = useState('');
  usePermissionApplock();
  const {handleComparePassword} = useLoginWithCredentials();
  const {shake, rStyle} = useAnimatedShake();
  const lessonStore = useLessonStore();
  const loadingGlobal = useLoadingGlobal();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const onSubmit = async () => {
    loadingGlobal.show?.();
    const res = await handleComparePassword({password: passwordRef.current});
    if (res === 200) {
      lessonStore.setPasswordParent(passwordRef.current);
      changeIsShowAuth?.();
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
  return (
    <ImageBackground
      style={[styles.container]}
      source={assets.bee_bg}
      imageStyle={styles.imageStyle}
      resizeMode="cover">
      <ScrollView>
        <Animated.View style={[rStyle, animatedStyle]}>
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
    </ImageBackground>
  );
};

export default AuthParentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8cc',
    paddingHorizontal: 30,
    paddingVertical: 40,
    paddingTop: 200,
  },
  imageStyle: {opacity: 0.3},
  btnEnter: {
    marginTop: 70,
    paddingVertical: scale(12),
  },
  errorMsg: {
    ...CustomTextStyle.body2,
    color: COLORS.ERROR,
  },
});
