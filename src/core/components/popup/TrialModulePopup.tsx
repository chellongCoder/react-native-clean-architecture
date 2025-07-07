import React, {useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {assets} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import useAuthenStore from 'src/authentication/presentation/hooks/useAuthenStore';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {
  navigateScreen,
  resetNavigator,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {useI18n} from 'src/core/presentation/hooks/useI18n';

interface TrialModulePopupProps {
  isVisible: boolean;
  onClose: () => void;
  handleToggleTrialPopup: (callback?: () => void) => void;
}

const TrialModulePopup: React.FC<TrialModulePopupProps> = ({
  isVisible,
  onClose,
  handleToggleTrialPopup,
}) => {
  const i18n = useI18n();
  const authStore = useAuthenStore();
  const homeStore = useHomeStore();

  const isStart = useMemo(() => {
    const statusTrial = homeStore.checkDoingModule(
      authStore.userProfile,
      homeStore.moduleItem,
    );

    return !authStore.userProfile?.isTrial && statusTrial === 'no_trial';
  }, [authStore.userProfile, homeStore]);

  const onUpdate = async () => {
    if (homeStore.moduleItem) {
      handleToggleTrialPopup(() => {
        navigateScreen(STACK_NAVIGATOR.HOME.LESSON, {
          lessonId: homeStore.moduleItem?.id,
          lessonName: homeStore.moduleItem?.lessonName,
          moduleName: homeStore.moduleItem?.title,
        });
      });
      authStore.updateTrialModules({});
    } else {
      homeStore.setIsGotoBuyModule(true);
      handleToggleTrialPopup();
      resetNavigator(STACK_NAVIGATOR.HOME.HOME_SCREEN, {});
      navigateScreen(STACK_NAVIGATOR.BOTTOM_TAB.PARENT_TAB, {});
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      style={{height: 500, width: '100%'}}
      onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.centeredView}
      />
      <View style={styles.contentContainer}>
        <View style={styles.wrapContentContainer}>
          <Text style={[styles.title, {marginVertical: 24, marginTop: 64}]}>
            {isStart
              ? i18n.t('popup.TrialModule.title')
              : i18n.t('popup.TrialModule.endTrial')}
          </Text>
          <Text style={styles.subTitle}>
            {i18n.t('popup.TrialModule.description')}
          </Text>
          <Text style={styles.description}>
            {i18n.t('popup.TrialModule.description2')}
          </Text>
        </View>
        <View style={styles.ctnButton}>
          <TouchableOpacity
            style={[
              styles.wrapBtnContainer,
              {backgroundColor: COLORS.RED_E1460E},
            ]}
            onPress={() => {
              handleToggleTrialPopup();
            }}>
            <Text style={[styles.subTitle, {color: COLORS.WHITE_FBF8CC}]}>
              {i18n.t('popup.TrialModule.notReady')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wrapBtnContainer} onPress={onUpdate}>
            <Text style={[styles.subTitle, {color: COLORS.WHITE_FBF8CC}]}>
              {i18n.t('popup.TrialModule.start')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapImageContainer}>
          <Image
            source={assets.upgradeApp}
            resizeMode="contain"
            style={{height: '100%', width: '100%'}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: scale(32),
  },
  contentContainer: {
    borderRadius: scale(32),
    padding: scale(16),
    backgroundColor: COLORS.WHITE_FBF8CC,
    width: '90%',
    zIndex: 999,
    position: 'absolute',
    alignSelf: 'center',
    top: '20%',
    alignItems: 'center',
  },
  wrapContentContainer: {
    marginHorizontal: scale(20),
  },
  ctnButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapBtnContainer: {
    borderRadius: scale(46),
    backgroundColor: COLORS.YELLOW_F2B559,
    marginTop: verticalScale(16),
    padding: scale(16),
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: scale(10),
  },
  wrapImageContainer: {
    position: 'absolute',
    width: '100%',
    height: scale(150),
    top: -verticalScale(80),
  },
  title: {
    fontSize: scale(28),
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    textAlign: 'center',
    color: COLORS.GREEN_4CB572,
  },
  subTitle: {
    fontSize: scale(16),
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
  },
  description: {
    fontSize: scale(16),
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
  },
});

export default TrialModulePopup;
