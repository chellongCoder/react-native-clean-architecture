import React, {
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
} from 'react-native';
import {assets} from '../utils';
import {Dispatch} from 'react';
import {TIapState} from '../store/iapProvider';
import {TYPOGRAPHY} from '../constants/typography';
import {COLORS} from '../constants/colors';

type TPros = {
  isSuccess: boolean;
  setIapState: Dispatch<TIapState>;
};

const PurchaseSuccessScreen = (props: TPros) => {
  const {isSuccess, setIapState} = props;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          isSuccess
            ? assets.paymentSuccessBackground
            : assets.paymentFailBackground
        }
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode="cover">
        <Image
          source={isSuccess ? assets.checkCircle : assets.failCircle}
          style={{height: 133, width: 133, marginBottom: 32}}
        />
        {isSuccess ? (
          <>
            <Text style={styles.title}>{'Thanh toán\nthành công!'}</Text>
            <Text style={styles.subTitle}>Bạn đã thanh toán thành công</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>{'Thanh toán\nkhông thành công!'}</Text>
            <Text style={styles.subTitle}>
              {'Giao dịch thanh toán của bạn\nkhông thành công'}
            </Text>
          </>
        )}
        <TouchableOpacity
          style={styles.wrapCloseBtnContainer}
          onPress={() => {
            setIapState({isShowModal: false, isPurchaseSuccess: false});
          }}>
          <Text style={styles.closeBtnTitle}>Close</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default PurchaseSuccessScreen;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    fontSize: 36,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
    fontSize: 20,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
    marginTop: 16,
  },
  wrapCloseBtnContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: COLORS.YELLOW_F2B559,
    position: 'absolute',
    bottom: 80,
  },
  closeBtnTitle: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
    color: COLORS.WHITE_FBF8CC,
    fontSize: 16,
  },
});
