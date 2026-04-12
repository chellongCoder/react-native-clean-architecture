import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconUser from 'assets/svg/IconUser';
import BookView from '../components/BookView';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import IconBook from 'assets/svg/IconBook';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import PurchaseSuccessScreen from 'src/core/presentation/screens/PurchaseSuccessScreen';
import useGetModulesBySubject from '../hooks/useGetModulesBySubject';
import {assets} from 'src/core/presentation/utils';

interface Props {
  route: RouteProp<ParamListBase>;
}

const NewMoreScreen = observer((props: Props) => {
  const {route} = props;
  const {subject} = route?.params as {
    subject: Subject;
  };

  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();
  const i18n = useI18n();

  const {
    modules,
    isLoading,
    userModule,
    loadingModuleId,
    purchaseState,
    setPurchaseState,
    onBuyModule,
    userProfile,
  } = useGetModulesBySubject({subjectId: subject._id});

  const renderModule = useCallback(
    ({item}: {item: Module}) => {
      console.log('🚀 ~ item:', item.description);
      return (
        <View style={styles.item}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: scale(16),
            }}>
            <View style={styles.iconBook}>
              <IconBook />
            </View>
            <View style={styles.itemContent}>
              <Text
                numberOfLines={2}
                style={[globalStyle.txtLabel, styles.textColor]}>
                {item.name}
              </Text>
              <Text
                numberOfLines={2}
                style={[globalStyle.txtNote, styles.textColor, styles.txtDesc]}>
                {item.description}
              </Text>
            </View>
          </View>

          {userModule.some(userMod => userMod.lessonId === item._id) ? (
            <Text style={[globalStyle.txtLabel, styles.textColor]}>
              Purchased
            </Text>
          ) : (
            <View
              style={{
                alignItems: 'flex-end',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: scale(2),
                }}>
                <Text style={[globalStyle.txtLabel, styles.textColor]}>
                  {item.price}
                </Text>
                <Image
                  source={assets.diamond}
                  resizeMode="contain"
                  style={{width: scale(16), height: scale(16)}}
                />
              </View>
              <View style={{flex: 1}} />
              <TouchableOpacity
                style={[styles.button, styles.w70]}
                onPress={() => onBuyModule(item)}
                disabled={loadingModuleId === item._id}>
                <Text style={[globalStyle.txtButton, styles.textBtn]}>
                  {loadingModuleId === item._id
                    ? 'Loading...'
                    : i18n.t('lesson.screens.NewMoreScreen.buyModule')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    },
    [userModule, loadingModuleId, globalStyle, i18n, onBuyModule],
  );

  return (
    <View style={[styles.fill, styles.bg, {paddingTop: insets.top}]}>
      <View style={[styles.head]}>
        <View style={[styles.rowBetween]}>
          <AccountStatus
            isShowDiamond={true}
            isShowLogout={true}
            diamond={userProfile?.diamond ?? 0}
          />
        </View>
        <TouchableOpacity style={[styles.profile]}>
          <IconUser width={70} height={70} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pt16, styles.rowHCenter]}>
          <Text style={[globalStyle.txtLabel, styles.txtParentName]}>
            {userProfile?.username}
          </Text>
        </TouchableOpacity>
        <Text style={[globalStyle.txtNote, styles.textColor]}>
          {userProfile?.emailOrPhoneNumber}
        </Text>
      </View>

      <BookView
        style={[styles.mt16, styles.fill, {paddingHorizontal: scale(16)}]}
        colorBg={COLORS.WHITE_FFE699}
        contentStyle={styles.fill}>
        <View style={styles.title}>
          <Text style={[globalStyle.txtLabel, styles.txtTitle]}>
            {`${subject.name}\n${i18n.t(
              'lesson.screens.NewMoreScreen.newMoreModulesList',
            )}`}
          </Text>
        </View>
        <FlatList
          data={modules}
          renderItem={renderModule}
          keyExtractor={item => item._id}
          contentContainerStyle={[styles.bookContent]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[globalStyle.txtWord, styles.textColor]}>
                {isLoading
                  ? 'Loading...'
                  : i18n.t('lesson.screens.NewMoreScreen.noModulesAvailable')}
              </Text>
            </View>
          }
        />
      </BookView>
      {purchaseState.isShowModal ? (
        <View style={styles.absoluteContent}>
          <PurchaseSuccessScreen
            isSuccess={purchaseState.isPurchaseSuccess ?? false}
            setIapState={state => setPurchaseState(state)}
          />
        </View>
      ) : null}
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
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    height: verticalScale(120),
    width: verticalScale(120),
    backgroundColor: COLORS.YELLOW_FFE699,
    borderRadius: verticalScale(60),
    borderWidth: verticalScale(6),
    borderColor: COLORS.YELLOW_F2B559,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  head: {
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },
  textColor: {
    color: COLORS.GREEN_1C6349,
  },
  txtParentName: {
    color: COLORS.GREEN_1C6349,
    marginRight: scale(12),
  },
  pt16: {
    paddingTop: scale(16),
  },
  mt16: {
    marginTop: scale(16),
  },
  bookContent: {},
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(16),
    paddingLeft: scale(8),
  },
  txtTitle: {
    color: COLORS.GREEN_1C6349,
    fontSize: scale(16),
  },
  item: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: verticalScale(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    padding: verticalScale(16),
  },
  itemContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: scale(130),
    gap: verticalScale(4),
  },
  txtDesc: {
    maxWidth: scale(200),
  },
  iconBook: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(15),
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.GREEN_66C270,
    padding: verticalScale(8),
    borderRadius: verticalScale(10),
    alignItems: 'center',
  },
  w70: {},
  textBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE_FBF8CC,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(20),
  },
  absoluteContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
