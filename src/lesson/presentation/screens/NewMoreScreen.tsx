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

          <Price price="FREE" />
        </View>
        <View style={[styles.profile]}>
          <IconUser width={70} height={70} />
        </View>
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
      <View style={[styles.center, styles.iconClose]}>
        <IconCloseCircle />
      </View>
      <BookView style={[styles.mt16, styles.fill]} colorBg="#FFE699">
        <View style={styles.title}>
          <Text style={[globalStyle.txtLabel, styles.txtTitle]}>
            Vietnamese{'\n'}New more modules list
          </Text>
        </View>
        <ScrollView contentContainerStyle={[styles.bookContent]}>
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
              <TouchableOpacity style={[styles.button, styles.w70]}>
                <Text style={[globalStyle.txtButton, styles.textBtn]}>Buy</Text>
              </TouchableOpacity>
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
              <TouchableOpacity style={[styles.button, styles.w70]}>
                <Text style={[globalStyle.txtButton, styles.textBtn]}>Buy</Text>
              </TouchableOpacity>
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
          <TouchableOpacity style={[styles.button]}>
            <Text style={[globalStyle.txtButton, styles.textBtn]}>
              Check out
            </Text>
          </TouchableOpacity>
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
  bookContent: {
    paddingHorizontal: 16,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
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
    backgroundColor: '#FBF8CC',
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
    height: 94.87,
    backgroundColor: '#FBF8CC',
    borderRadius: 30,
    width: 370,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  itemContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 152,
    gap: 4,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    height: 28,
    width: 90,
    top: 15,
    position: 'relative',
  },
  w70: {
    width: 70,
  },
  textBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FBF8CC',
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
    color: '#FBF8CC',
  },
});
