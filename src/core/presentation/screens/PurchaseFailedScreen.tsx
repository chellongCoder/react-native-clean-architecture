import React, {View, Text, StyleSheet, Image} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import useGlobalStyle from '../hooks/useGlobalStyle';
import {assets} from '../utils';

const PurchaseFailedScreen = ({navigation}) => {
  const styleHook = useGlobalStyle();

  return (
    <View style={styles.container}>
      <Image
        source={assets.paymentFailed}
        style={{height: '100%', width: '100%'}}
        resizeMode="cover"
      />
    </View>
  );
};

export default PurchaseFailedScreen;
const styles = StyleSheet.create({
  container: {
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
