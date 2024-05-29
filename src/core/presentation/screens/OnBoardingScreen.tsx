import React, {View, Text, StyleSheet} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import useGlobalStyle from '../hooks/useGlobalStyle';

export default function OnBoardingScreen({
  navigation,
}: RootStackScreenProps<'NotFound'>) {
  const styleHook = useGlobalStyle();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styleHook.txtWord]}>Loading ...</Text>
    </View>
  );
}

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
