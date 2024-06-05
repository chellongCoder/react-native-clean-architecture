import React, {View, Text, StyleSheet} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import useGlobalStyle from '../hooks/useGlobalStyle';
import {useEffect} from 'react';
import {navigateScreen} from '../navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from '../navigation/ConstantNavigator';

const OnBoardingScreen = ({navigation}) => {
  const styleHook = useGlobalStyle();

  useEffect(() => {
    setTimeout(() => {
      navigateScreen(STACK_NAVIGATOR.AUTH.LOGIN_SCREEN);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styleHook.txtWord]}>Loading ...</Text>
    </View>
  );
};

export default OnBoardingScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#66C270',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontWeight: '400',
    fontSize: 40,
    textAlign: 'center',
    color: '#FBF8CC',
    transform: [{translateY: 200}],
  },
});
