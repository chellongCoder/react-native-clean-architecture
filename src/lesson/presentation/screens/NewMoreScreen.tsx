import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconUser from 'assets/svg/IconUser';
import BookView from '../components/BookView';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import IconBook from 'assets/svg/IconBook';
import IconCheckout from 'assets/svg/IconCheckout';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';
import GetUserProfileResponse from 'src/authentication/application/types/GetUserProfileResponse';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import {Module} from 'src/home/application/types/GetListLessonResponse';
import AccountStatus from 'src/home/presentation/components/AccountStatus';
import {useLessonStore} from '../stores/LessonStore/useGetPostsStore';
import PurchaseSuccessScreen from 'src/core/presentation/screens/PurchaseSuccessScreen';
import {UserModule} from 'src/lesson/application/types/GetUserModuleResponse';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import Diamond from 'src/home/presentation/components/Diamond';
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
  const homeStore = useHomeStore();
  const authStore = useAuthenStore();
  const lessonStore = useLessonStore();
  const {handleGetUserProfile} = useGetUserProfile();
  const {userProfile} = useAuthenticationStore();

  const [modules, setModules] = useState<Module[]>([]);
  const [userModule, setUserModule] = useState<UserModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  const [purchaseState, setPurchaseState] = useState<{
    isShowModal?: boolean;
    isPurchaseSuccess?: boolean;
  }>({
    isShowModal: false,
    isPurchaseSuccess: false,
  });

  const onCheckout = () => {
    console.log('onCheckout');
  };

  const onBuyModule = async (item: Module) => {
    try {
      setLoadingModuleId(item._id);
      const res = await lessonStore.handleBuyUserModule({
        lessonId: item._id,
      });
      if (res) {
        handleGetUserProfile();
        setPurchaseState({
          isShowModal: true,
          isPurchaseSuccess: true,
        });
      }
    } catch (error) {
      setPurchaseState({
        isShowModal: true,
        isPurchaseSuccess: false,
      });
    } finally {
      setLoadingModuleId(null);
    }
  };

  useEffect(() => {
    const handleGetUserModule = async () => {
      try {
        const res = await lessonStore.handleGetUserModule(modules);
        setUserModule(res);
      } catch (error) {
        console.log('error', error);
      }
    };
    handleGetUserModule();
  }, [lessonStore, modules, purchaseState.isPurchaseSuccess]);

  useEffect(() => {
    setIsLoading(true);
    homeStore
      .getListModules({
        subjectId: subject._id,
        childrenId: authStore.selectedChild?._id ?? '',
      })
      .then(response => {
        setModules(response.data);
      })
      .finally(() => setIsLoading(false));
  }, [
    authStore.selectedChild?._id,
    homeStore,
    homeStore.subjectId,
    subject._id,
    subject.fieldId,
  ]);

  const renderModule = ({item}: {item: Module}) => {
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
              style={[globalStyle.txtNote, styles.textColor]}>
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
                {item.price} Diamond
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
  };

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
        style={[styles.mt16, styles.fill, {paddingHorizontal: 16}]}
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
        {/* <View style={styles.checkout}>
          <TouchableOpacity style={styles.iconCheckout} onPress={onCheckout}>
            <View style={styles.dot}>
              <Text style={[globalStyle.txtButton, styles.textDot]}>2</Text>
            </View>
            <IconCheckout />
          </TouchableOpacity>
        </View> */}
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
  btnLogout: {
    backgroundColor: COLORS.GREEN_66C270,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderRadius: 50,
  },
  txtLogout: {
    color: COLORS.GREEN_1C6349,
  },
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    height: 120,
    width: 120,
    backgroundColor: COLORS.YELLOW_FFE699,
    borderRadius: 60,
    borderWidth: 6,
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
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  textColor: {
    color: COLORS.GREEN_1C6349,
  },
  txtParentName: {
    color: COLORS.GREEN_1C6349,
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
    marginVertical: 16,
    paddingLeft: 8,
  },
  txtTitle: {
    color: COLORS.GREEN_1C6349,
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
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
  },
  itemContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: scale(152),
    gap: verticalScale(4),
  },
  iconBook: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.GREEN_66C270,
    padding: 8,
    borderRadius: scale(10),
    alignItems: 'center',
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
    marginBottom: 16,
  },
  iconCheckout: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.GREEN_66C270,
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.RED_DD2424,
    borderRadius: 15,
    zIndex: 2,
  },
  textDot: {
    fontSize: 8,
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
