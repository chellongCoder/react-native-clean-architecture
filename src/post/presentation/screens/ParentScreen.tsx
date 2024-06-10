import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Price from '../components/Price';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconLogout from 'assets/svg/IconLogout';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconUser from 'assets/svg/IconUser';
import IconEdit from 'assets/svg/IconEdit';
import BookView from '../components/BookView';
import IconLock from 'assets/svg/IconLock';
import IconSetting from 'assets/svg/IconSetting';
import IconPurchase from 'assets/svg/IconPurchase';
import PrimaryButton from '../components/PrimaryButton';
import IconArrowDown from 'assets/svg/IconArrowDown';
import IconArrowUp from 'assets/svg/IconArrowUp';
import IconBlock from 'assets/svg/IconBlock';
import IconArrowFill from 'assets/svg/IconArrowFill';
import IconAddCircle from 'assets/svg/IconAddCircle';

const ParentScreen = () => {
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
      <BookView style={[styles.mt16, styles.fill]}>
        <ScrollView contentContainerStyle={[styles.bookContent]}>
          <View style={[styles.rowBetween, styles.ph16]}>
            <TouchableOpacity>
              <View style={[styles.tabItem]}>
                <IconLock />
              </View>
              <Text style={[globalStyle.txtButton, styles.txtTab]}>
                App block
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.tabItem]}>
                <IconSetting />
              </View>
              <Text style={[globalStyle.txtButton, styles.txtTab]}>
                Setting
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.tabItem]}>
                <IconPurchase />
              </View>
              <Text style={[globalStyle.txtButton, styles.txtTab]}>
                Purchase
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.bodyBook]}>
            <Text style={[globalStyle.txtLabel, styles.txtTitleBook]}>
              App Block
            </Text>
            <View style={[styles.rowBetween, styles.rowHCenter]}>
              <View style={[styles.arrowLeft]}>
                <IconArrowFill />
              </View>
              <View style={[styles.rowBetween, styles.fill]}>
                <View style={[styles.bodyItem]}>
                  <IconBlock />
                </View>
                <View style={[styles.bodyItem]}>
                  <IconBlock />
                </View>
                <View style={[styles.bodyItem]}>
                  <IconBlock />
                </View>
              </View>
              <View style={[styles.arrowRight]}>
                <IconArrowFill type="right" />
              </View>
            </View>
          </View>
          <View style={[styles.bodyContent, styles.rowBetween]}>
            <View style={[styles.fill, styles.rowBetween]}>
              <View style={[styles.fill]}>
                <View style={[]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    App to lock
                  </Text>
                  <View style={[styles.card]}>
                    <Text style={[globalStyle.txtButton, styles.textCard]}>
                      Youtobe
                    </Text>
                    <IconArrowDown />
                  </View>
                </View>
                <View style={[]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    Lessons to unlock
                  </Text>
                  <View style={[styles.card]}>
                    <Text style={[globalStyle.txtButton, styles.textCard]}>
                      Vietnamese
                    </Text>
                    <IconArrowDown />
                  </View>
                </View>
              </View>
              <View style={[styles.fill]}>
                <View style={[]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    Score to unlock
                  </Text>
                  <View style={[styles.card]}>
                    <Text style={[globalStyle.txtButton, styles.textCard]}>
                      100
                    </Text>
                    <IconArrowUp />
                  </View>
                </View>
                <View style={[]}>
                  <Text style={[globalStyle.txtButton, styles.textColor]}>
                    Your unlock score
                  </Text>
                  <View style={[styles.card]}>
                    <Text style={[globalStyle.txtButton, styles.textCard]}>
                      100
                    </Text>
                    <IconArrowUp />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View style={[styles.fill]} />
              <PrimaryButton
                text="Unlock"
                style={[styles.btnCommon, styles.btnRed]}
              />
              <PrimaryButton text="Save" style={[styles.btnCommon]} />
            </View>
          </View>
          <View style={[styles.bodyBookTwo]}>
            <Text style={[globalStyle.txtLabel, styles.txtTitleBookTwo]}>
              Children accounts list
            </Text>
            <View style={[styles.rowBetween, styles.rowHCenter]}>
              <View style={[styles.arrowLeft]}>
                <IconArrowFill />
              </View>
              <View style={[styles.rowBetween, styles.fill]}>
                <View style={[styles.bodyItemTwo]}>
                  <IconAddCircle />
                </View>
                <View style={[styles.bodyItemTwo]}>
                  <IconAddCircle />
                </View>
                <View style={[styles.bodyItemTwo]}>
                  <IconAddCircle />
                </View>
              </View>
              <View style={[styles.arrowRight]}>
                <IconArrowFill type="right" />
              </View>
            </View>
          </View>
          <View style={[styles.bodyContent, styles.rowBetween]}>
            <View style={[styles.fill, styles.mr16]}>
              <TouchableOpacity
                style={[styles.rowHCenter, styles.fill, styles.rowBetween]}>
                <Text style={[globalStyle.txtLabel, styles.txtParentName]}>
                  Child’s Name - age
                </Text>
                <IconEdit />
              </TouchableOpacity>
              <Text style={[globalStyle.txtNote, styles.mb12]}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text Lorem Ipsum has been....
              </Text>
            </View>
            <View>
              <View style={[styles.fill]} />
              <PrimaryButton text="Use" style={[styles.btnCommon]} />
              <PrimaryButton
                text="Delete"
                style={[styles.btnCommon, styles.btnRed]}
              />
            </View>
          </View>
        </ScrollView>
      </BookView>
    </View>
  );
};

export default ParentScreen;

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
  txtTab: {
    textAlign: 'center',
    color: '#1C6349',
    paddingTop: 8,
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
  mt16: {
    marginTop: 16,
  },
  mr16: {
    marginRight: 16,
  },
  arrowLeft: {
    marginRight: 8,
  },
  arrowRight: {
    marginLeft: 8,
  },
  bookContent: {
    paddingHorizontal: 16,
  },
  tabItem: {
    height: 64,
    width: 64,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#258F78',
  },
  bodyBook: {
    borderRadius: 30,
    backgroundColor: '#78C5B4',
    paddingVertical: 24,
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
  txtTitleBookTwo: {
    color: '#1C6349',
    marginBottom: 16,
    marginLeft: 16,
  },
  bodyItem: {
    height: 85,
    width: 85,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#258F78',
    borderColor: '#258F78',
    borderWidth: 3,
  },
  bodyItemTwo: {
    height: 85,
    width: 85,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2B559',
    borderColor: '#F2B559',
    borderWidth: 3,
  },
  bodyContent: {
    marginTop: -50,
    paddingTop: 66,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FBF8CC',
  },
  btnCommon: {
    width: 80,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  btnRed: {
    backgroundColor: '#F28759',
  },
  card: {
    paddingVertical: 8,
    borderRadius: 20,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE699',
    alignSelf: 'flex-start',
    marginRight: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  textCard: {
    color: '#1C6349',
    marginRight: 4,
  },
});
