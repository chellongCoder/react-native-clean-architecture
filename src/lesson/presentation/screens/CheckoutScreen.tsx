/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import IconUser from 'assets/svg/IconUser';
import Username from '../components/Username';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import {observer} from 'mobx-react';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import BookView from '../components/BookView';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import IconCloseCircle from 'assets/svg/IconCloseCircle';
import PrimaryButton from '../components/PrimaryButton';
import {assets} from 'src/core/presentation/utils';
import ItemCard from '../components/ItemCard';
import CheckSelect from 'src/core/components/checkSelect/CheckSelect';

const CheckoutScreen = observer(() => {
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  return (
    <View style={[styles.fill, styles.bg, {paddingTop: insets.top}]}>
      <View style={[styles.head, {}]}>
        <View style={[styles.rowBetween]}>
          <AccountStatus isShowLogout={true} />
        </View>
        <View style={[styles.profile_border]}>
          <View style={[styles.profile]}>
            <IconUser width={70} height={70} />
          </View>
        </View>
        <Username />
      </View>
      <BookView
        style={[styles.fill]}
        colorBg={COLORS.WHITE_FFE699}
        contentStyle={[styles.ph16, {marginTop: 24}]}>
        <TouchableOpacity onPress={goBack} style={{alignSelf: 'center'}}>
          <IconCloseCircle />
        </TouchableOpacity>
        <Text
          style={[
            globalStyle.txtLabel,
            {paddingTop: verticalScale(8), color: COLORS.GREEN_1C6349},
          ]}>
          YOUR CHECKOUT LIST
        </Text>
        <View
          style={{
            backgroundColor: COLORS.WHITE_FBF8CC,
            borderRadius: 20,
            padding: scale(16),
            marginVertical: verticalScale(6),
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: verticalScale(20),
              }}>
              <ItemCard
                Icon={
                  <Image
                    source={assets.diamond_pack}
                    style={{
                      height: '90%',
                      width: '90%',
                      marginRight: scale(12),
                    }}
                  />
                }
                backgroundFocusColor={COLORS.WHITE_FBF8CC}
                backgroundColor={COLORS.BLUE_258F78}
                borderWidth={4}
                isFocus={true}
                size={scale(90)}
              />
              <View style={{marginLeft: scale(14)}}>
                <Text
                  style={[
                    globalStyle.txtLabel,
                    {
                      color: COLORS.YELLOW_F2B559,
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: verticalScale(6),
                    },
                  ]}>
                  Pack of{'\n'}10 diamonds
                </Text>
                <View
                  style={{
                    borderRadius: 100,
                    backgroundColor: COLORS.WHITE_FBF8CC,
                    borderWidth: 2,
                    borderColor: COLORS.GREEN_66C270,
                    padding: scale(8),
                    alignSelf: 'baseline',
                  }}>
                  <Text style={[{color: COLORS.BLUE_258F78}]}>$1.99 SGD</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                borderColor: COLORS.BLUE_258F78,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderStyle: 'solid',
                paddingVertical: verticalScale(12),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: verticalScale(22),
                }}>
                <Text
                  style={[
                    {
                      color: COLORS.GREEN_1C6349,
                      fontSize: scale(20),
                    },
                  ]}>
                  TOTAL:
                </Text>
                <Text
                  style={[
                    {
                      color: COLORS.GREEN_1C6349,
                      fontWeight: 'bold',
                      fontSize: scale(20),
                    },
                  ]}>
                  $1.99 SGD
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: verticalScale(10)}}>
              <Text
                style={{
                  width: '30%',
                  color: '#258F78',
                  fontSize: 12,
                }}>
                Payment
              </Text>
              <View style={{flexWrap: 'wrap', flexDirection: 'row', flex: 1}}>
                {['Credit card', 'MOMO', 'QR code', 'Google pay'].map(e => (
                  <View style={{width: '50%', marginBottom: verticalScale(14)}}>
                    <CheckSelect
                      name={e}
                      isSelected={false}
                      onPress={() => {
                        //
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <PrimaryButton
          text="Checkout"
          style={{marginTop: verticalScale(20), borderRadius: 100}}
        />
      </BookView>
    </View>
  );
});

export default withProviders(LessonStoreProvider)(CheckoutScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    backgroundColor: '#fbf8cc',
  },
  btnLogout: {
    backgroundColor: '#66C270',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderRadius: 50,
  },
  txtLogout: {
    color: '#1C6349',
    paddingLeft: 8,
  },
  profile_border: {
    height: 120,
    width: 120,
    backgroundColor: '#F2B559',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 60,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFE699',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  head: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  textColor: {
    color: '#1C6349',
  },
  txtParentName: {
    color: '#1C6349',
    marginRight: 12,
  },
  pt16: {
    paddingTop: 16,
  },
  ph16: {
    paddingHorizontal: 16,
  },
  mb12: {
    marginBottom: 12,
  },
  mt4: {
    marginTop: 4,
  },
  mt16: {
    marginTop: 16,
  },
  mr16: {
    marginRight: 16,
  },
  mr32: {
    marginRight: 32,
  },
  arrowLeft: {
    marginRight: 8,
  },
  arrowRight: {
    marginLeft: 8,
  },
  bookContent: {
    paddingHorizontal: 16,
    paddingBottom: scale(54),
  },
  bodyBook: {
    borderRadius: 30,
    backgroundColor: '#78C5B4',
    paddingVertical: 20,
    paddingHorizontal: 8,
    marginTop: 32,
    zIndex: 50,
  },
  bodyBookTwo: {
    borderRadius: 30,
    backgroundColor: '#FFE287',
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginTop: 32,
    zIndex: 50,
  },
  txtTitleBook: {
    color: '#FBF8CC',
    marginBottom: 16,
    marginLeft: 16,
  },
  txtTitleBlue: {
    color: '#78C5B4',
    marginBottom: 16,
  },
  txtTitleBookTwo: {
    color: '#1C6349',
    marginBottom: 16,
    marginLeft: 16,
  },
  bodyContent: {
    marginTop: -50,
    paddingTop: 66,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FBF8CC',
  },
  bodySetting: {
    marginTop: 32,
    paddingTop: 16,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FBF8CC',
  },
  btnCommon: {
    width: 80,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  round: {
    borderRadius: 300,
    width: scale(90),
  },
  btnOrange: {
    backgroundColor: '#F2B559',
  },
  btnRed: {
    backgroundColor: '#F28759',
  },
  card: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(8),
    borderRadius: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFE699',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    marginRight: scale(8),
  },
  textCard: {
    color: '#1C6349',
    marginRight: 4,
  },
  wrapAddChildContainer: {
    flexDirection: 'row',
    marginTop: scale(16),
  },
  addChildContainer: {
    height: scale(88),
    width: scale(88),
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  addChildContent: {
    height: scale(80),
    width: scale(80),
    backgroundColor: COLORS.WHITE_FBF8CC,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  childrenName: {
    ...CustomTextStyle.caption,
    color: COLORS.BLUE_1C6349,
    marginTop: scale(4),
  },
  dropdown: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
    top: 40,
    position: 'absolute',
    zIndex: -1,
    width: scale(70),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  option: {
    paddingVertical: verticalScale(6),
    color: COLORS.GREEN_1C6349,
  },
});
