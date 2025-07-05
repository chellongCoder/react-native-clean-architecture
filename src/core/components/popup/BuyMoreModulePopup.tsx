import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {assets} from 'src/core/presentation/utils';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useI18n} from 'src/core/presentation/hooks/useI18n';

interface BuyMoreModulePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const BuyMoreModulePopup: React.FC<BuyMoreModulePopupProps> = ({
  isVisible,
  onClose,
}) => {
  const i18n = useI18n();
  const homeStore = useHomeStore();

  const onBuyMore = () => {
    onClose();
    homeStore.setIsGotoBuyModule(true);
    navigateScreen(STACK_NAVIGATOR.BOTTOM_TAB.PARENT_TAB, {});
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      style={{height: 500, width: '100%'}}
      onRequestClose={() => onClose()}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          onClose();
        }}
        style={styles.centeredView}
      />
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={assets.buyMoreImage}
            resizeMode="contain"
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <TouchableOpacity
          style={styles.closeBuyMoreContainer}
          onPress={onClose}>
          <Image
            source={assets.closeBuyMore}
            resizeMode="contain"
            style={{height: '100%', width: '100%'}}
          />
        </TouchableOpacity>
        <Text style={[styles.title, {paddingHorizontal: scale(64)}]}>
          {i18n.t('popup.BuyMoreModule.youChildHasFinished')}
        </Text>

        <TouchableOpacity style={styles.btnContainer} onPress={onBuyMore}>
          <Text style={styles.btnText}>
            {i18n.t('popup.BuyMoreModule.buyNewModules')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.noThanksText}>
          {i18n.t('popup.BuyMoreModule.noThanks')}
        </Text>
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
  },
  contentContainer: {
    borderRadius: 32,
    paddingVertical: scale(16),
    backgroundColor: COLORS.BLUE_63C1AD,
    width: '90%',
    zIndex: 999,
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
  },
  title: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
    fontSize: 24,
    color: COLORS.WHITE,
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  wrapImageContainer: {},
  imageContainer: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: -24,
    top: -24,
  },
  closeBuyMoreContainer: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 999,
  },
  btnContainer: {
    backgroundColor: COLORS.BLUE_248F78,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
    marginHorizontal: scale(48),
  },
  btnText: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    fontSize: 22,
    color: COLORS.YELLOW_F2B559,
  },
  noThanksText: {
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
    fontSize: 20,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginHorizontal: scale(48),
  },
});

export default BuyMoreModulePopup;
