import React, {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {assets} from '../utils';
import {Dispatch} from 'react';
import {TIapState} from '../store/iapProvider';

type TPros = {
  isSuccess: boolean;
  setIapState: Dispatch<TIapState>;
};

const PurchaseSuccessScreen = (props: TPros) => {
  const {isSuccess, setIapState} = props;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        setIapState({isShowModal: false, isPurchaseSuccess: false})
      }>
      <Image
        source={isSuccess ? assets.paymentSuccess : assets.paymentFailed}
        style={{height: '100%', width: '100%'}}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

export default PurchaseSuccessScreen;
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
