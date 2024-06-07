import React, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import useGlobalStyle from '../hooks/useGlobalStyle';
import ICStar from 'src/core/components/icons/ICStar';
import IconUser from 'assets/svg/IconUser';
import IconDiamond from 'assets/svg/IconDiamond';
import ICStarOutLine from 'src/core/components/icons/ICStarOutLine';
import IconPlaySlider from 'assets/svg/IconPlaySlider';
import {observer} from 'mobx-react';
import ChartProfile from 'src/lesson/presentation/components/ChartProfile';
import {verticalScale} from 'react-native-size-matters';
const {width} = Dimensions.get('window');

const ProfileScreen = observer(({route, navigation}) => {
  const type = 'BOY';

  const styleHook = useGlobalStyle();

  const checkType = () => {
    return {backgroundColor: type == 'BOY' ? '##5EC7EA' : '#FFB29F'};
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: type == 'BOY' ? '#C2F0FF' : '#FFDFE4'},
      ]}>
      <View style={[styles.avatarContainer]}>
        <View style={styles.wrapperAvatar}>
          <View style={styles.wrapperFree}>
            <View style={styles.free}>
              <Text style={[styleHook.txtButton, styles.textFree]}>FREE</Text>
              <IconDiamond width={24} height={24} />
            </View>
            <View style={{...styles.free, backgroundColor: '#C2F0FF'}}>
              <Text
                style={[styleHook.txtButton, styles.textFree, {paddingTop: 5}]}>
                150
              </Text>
              <ICStar width={10} height={10} />
            </View>
          </View>
          <View style={[styles.circle, checkType()]}>
            <View style={styles.avatar}>
              <IconUser width={82} height={87} />
            </View>
          </View>
          <View style={[styles.square, checkType()]}>
            <TouchableOpacity style={styles.button}>
              <Text style={[styleHook.txtButton, styles.textBtn]}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentBorder}>
          <View style={styles.backgroundLeft} />
          <View style={styles.backgroundRight} />
        </View>
        <View style={styles.WrapperContent}>
          <View style={{maxWidth: 210, transform: [{translateY: 8}]}}>
            <Text style={[styleHook.txtLabel, styles.contentTitle]}>
              Child’s Name - age
            </Text>
            <Text style={[styleHook.txtNote, styles.contentDescription]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              Lorem Ipsum has been....
            </Text>
          </View>
          <View>
            <View style={styles.contentLevel}>
              <Text
                style={[styleHook.txtLabel, {fontSize: 16, color: 'white'}]}>
                Lv.1
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 40,
          }}>
          <View style={[{width: '90%', paddingBottom: verticalScale(50)}]}>
            <ChartProfile
              valuesAxitX={['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']}
              valueY={[80, 60, 5, 15, 30, 44, 333]}
            />
          </View>
          <View style={styles.achievementContainer}>
            <View style={styles.achievementTitle}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 30,
                  paddingRight: 30,
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    styleHook.txtLabel,
                    styles.contentTitle,
                    {marginBottom: 0},
                  ]}>
                  Achievement
                </Text>
                <View
                  style={{
                    borderRadius: 30,
                    width: 76,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: '#F2B559',
                  }}>
                  <Text
                    style={[
                      styleHook.txtLabel,
                      styles.contentTitle,
                      {marginBottom: 0},
                    ]}>
                    ?/??
                  </Text>
                </View>
              </View>
              <View style={styles.wrapperSlider}>
                <View style={{transform: [{translateY: 10}]}}>
                  <IconPlaySlider width={9} height={16} />
                </View>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: width,
                    marginTop: 20,
                  }}>
                  <View style={styles.itemSlide}>
                    <View style={styles.itemContent}>
                      <ICStarOutLine />
                    </View>
                  </View>
                  <View style={styles.itemSlide}>
                    <View style={styles.itemContent}>
                      <ICStarOutLine />
                    </View>
                  </View>
                  <View style={styles.itemSlide}>
                    <View style={styles.itemContent}>
                      <ICStarOutLine />
                    </View>
                  </View>
                </ScrollView>
                <View
                  style={{
                    transform: [{rotate: '180deg'}, {translateY: -10}],
                  }}>
                  <IconPlaySlider width={9} height={16} />
                </View>
                <View style={styles.wrapperDot}>
                  <View style={styles.dot} />
                  <View style={[styles.dot, {backgroundColor: 'white'}]} />
                  <View style={[styles.dot, {backgroundColor: 'white'}]} />
                </View>
              </View>
            </View>
            <View>
              <Text style={[styleHook.txtLabel, styles.contentTitle]}>
                Achievement
              </Text>
              <Text style={[styleHook.txtNote, styles.contentDescription]}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text Lorem Ipsum has been....
              </Text>
            </View>
          </View>
          <View style={{height: verticalScale(100)}} />
        </ScrollView>
      </View>
    </View>
  );
});
export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  avatarContainer: {
    marginTop: 50,
  },
  wrapperAvatar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{translateY: 100}],
    position: 'relative',
  },
  circle: {
    height: 149,
    width: 149,
    borderRadius: 100,
    transform: [{translateY: 30}],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  avatar: {
    width: 126,
    height: 126,
    borderRadius: 100,
    backgroundColor: '#FFE699',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    height: 194,
    width: 222,
    borderRadius: 48,
    paddingTop: 40,
  },
  wrapperFree: {
    position: 'absolute',
    top: 30,
    right: 20,
    flexDirection: 'column',
    gap: 5,
  },
  free: {
    width: 76,
    height: 30,
    backgroundColor: '#FFE699',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    paddingRight: 5,
    gap: 5,
  },
  textFree: {
    fontSize: 10,
    color: '#1C6349',
    fontWeight: 'bold',
  },
  contentBorder: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  backgroundLeft: {
    backgroundColor: '#DDF598',
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 40,
  },
  backgroundRight: {
    backgroundColor: '#DDF598',
    flex: 1,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 16,
  },
  boxAnswer: {
    flex: 1,
    padding: 32,
  },
  contentContainer: {
    width: '100%',
    height: '80%',
    position: 'relative',
    paddingTop: 80,
  },
  WrapperContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    gap: 30,
    flexDirection: 'row',
    width: '100%',
    transform: [{translateY: -20}],
  },
  contentTitle: {
    fontSize: 15,
    color: '#1C6349',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  contentDescription: {
    fontSize: 8,
    color: '#1C6349',
    lineHeight: 11,
  },
  contentLevel: {
    width: 74,
    height: 74,
    backgroundColor: '#F2B559',
    borderRadius: 15,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#DDF598',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    height: 28,
  },
  textBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1C6349',
  },
  achievementContainer: {
    backgroundColor: '#FBF8CC',
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: 370,
    height: 264,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    position: 'relative',
  },
  achievementTitle: {
    width: 370,
    height: 197,
    borderRadius: 30,
    position: 'absolute',
    backgroundColor: '#FFE287',
    paddingTop: 30,
    top: -30,
    left: 0,
  },
  itemSlide: {
    width: 88,
    height: 88,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2B559',
  },
  itemContent: {
    backgroundColor: '#FBF8CC',
    width: 80,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperSlider: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    gap: 10,
    position: 'relative',
  },
  wrapperDot: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    bottom: -20,
    left: '50%',
    zIndex: 2,
  },
  dot: {
    width: 4.6,
    height: 4.6,
    backgroundColor: '#F2B559',
    borderRadius: 100,
  },
});
