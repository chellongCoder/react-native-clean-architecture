import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconLogout from 'assets/svg/IconLogout';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconUser from 'assets/svg/IconUser';
import IconEdit from 'assets/svg/IconEdit';
import Price from '../components/Price';
import BookView from '../components/BookView';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import IconCloseCircle from 'assets/svg/IconCloseCircle';
import IconBook from 'assets/svg/IconBook';
import IconCheckout from 'assets/svg/IconCheckout';
import {scale, verticalScale} from 'react-native-size-matters';
import {HEIGHT_SCREEN} from 'src/core/presentation/utils';
import {COLORS} from 'src/core/presentation/constants/colors';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';

const NewMoreScreen = observer(() => {
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();

  return (
    <View style={[styles.fill, styles.bg, {paddingTop: insets.top}]}>
      <View style={[styles.head]}>
        <View style={[styles.rowBetween]}>
          <TouchableOpacity style={[styles.btnLogout, styles.rowHCenter]}>
            <IconLogout />
            <Text style={[globalStyle.txtButton, styles.txtLogout]}>
              Log out
            </Text>
          </TouchableOpacity>

          <Price price="100" />
        </View>
        <TouchableOpacity style={[styles.profile]}>
          <IconUser width={70} height={70} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pt16, styles.rowHCenter]}>
          <Text style={[globalStyle.txtLabel, styles.txtParentName]}>
            Parent's Name
          </Text>
          <IconEdit />
        </TouchableOpacity>
        <Text style={[globalStyle.txtNote, styles.textColor]}>
          Parent’s email
        </Text>
      </View>
      <TouchableOpacity
        onPress={goBack}
        style={[styles.center, styles.iconClose]}>
        <IconCloseCircle />
      </TouchableOpacity>
      <BookView style={[styles.mt16, styles.fill]} colorBg="#FFE699">
        <View style={styles.title}>
          <Text style={[globalStyle.txtLabel, styles.txtTitle]}>
            Vietnamese{'\n'}New more modules list
          </Text>
        </View>
        <ScrollView
          style={{height: HEIGHT_SCREEN / 4}}
          contentContainerStyle={[styles.bookContent]}>
          <View style={styles.lstItem}>
            <View style={styles.item}>
              <View style={styles.iconBook}>
                <IconBook />
              </View>
              <View style={styles.itemContent}>
                <Text style={[globalStyle.txtLabel, styles.textColor]}>
                  Module 1
                </Text>
                <Text style={[globalStyle.txtNote, styles.textColor]}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem
                </Text>
              </View>
              <View style={{gap: verticalScale(14), alignItems: 'center'}}>
                <Text style={[globalStyle.txtLabel, styles.textColor]}>
                  100$
                </Text>
                <TouchableOpacity style={[styles.button, styles.w70]}>
                  <Text style={[globalStyle.txtButton, styles.textBtn]}>
                    Add to cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.iconBook}>
                <IconBook />
              </View>
              <View style={styles.itemContent}>
                <Text style={[globalStyle.txtLabel, styles.textColor]}>
                  Module 1
                </Text>
                <Text style={[globalStyle.txtNote, styles.textColor]}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem
                </Text>
              </View>
              <View style={{gap: verticalScale(14), alignItems: 'center'}}>
                <Text style={[globalStyle.txtLabel, styles.textColor]}>
                  100$
                </Text>
                <TouchableOpacity style={[styles.button, styles.w70]}>
                  <Text style={[globalStyle.txtButton, styles.textBtn]}>
                    Add to cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.checkout}>
          <View style={styles.iconCheckout}>
            <View style={styles.dot}>
              <Text style={[globalStyle.txtButton, styles.textDot]}>2</Text>
            </View>
            <IconCheckout />
          </View>
        </View>
      </BookView>
    </View>
  );
});

export default withProviders(LessonStoreProvider)(NewMoreScreen);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    backgroundColor: COLORS.WHITE_FBF8CC,
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
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    height: 120,
    width: 120,
    backgroundColor: '#FFE699',
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#F2B559',
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
  mt16: {
    marginTop: 16,
  },
  bookContent: {},
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: verticalScale(20),
  },
  txtTitle: {
    color: '#1C6349',
    fontSize: 16,
  },
  bodyContent: {
    marginTop: -50,
    paddingTop: 66,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.WHITE_FBF8CC,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconClose: {
    top: 15,
  },
  lstItem: {
    flexDirection: 'column',
    gap: 16,
  },
  item: {
    height: verticalScale(94.87),
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(16),
  },
  itemContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: scale(152),
    gap: verticalScale(4),
  },
  iconBook: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F2B559',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#66C270',
    paddingVertical: verticalScale(8),
    borderRadius: scale(10),
    alignItems: 'center',
    height: verticalScale(28),
    width: scale(90),
  },
  w70: {
    width: 70,
  },
  textBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE_FBF8CC,
  },
  checkout: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  iconCheckout: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#66C270',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#DD2424',
    borderRadius: 15,
    zIndex: 2,
  },
  textDot: {
    fontSize: 8,
    color: COLORS.WHITE_FBF8CC,
  },
});
