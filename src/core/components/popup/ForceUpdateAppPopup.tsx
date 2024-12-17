import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {assets} from 'src/core/presentation/utils';
import {scale} from 'react-native-size-matters';

interface ForceUpdateAppPopupProps {
  isVisible: boolean;
  onClose: () => void;
  storeLink: string;
}

const ForceUpdateAppPopup: React.FC<ForceUpdateAppPopupProps> = ({
  isVisible,
  onClose,
  storeLink,
}) => {
  const onUpdate = async () => {
    await Linking.openURL(storeLink);
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
            Bạn cần cập nhật ứng dụng!!
          </Text>
          <Text style={styles.subTitle}>Phiên bản này đã hết hạn</Text>
          <Text style={styles.description}>
            {'Bạn cần cập nhật phiên bản\nmới để tiếp tục sử dụng'}
          </Text>
          <TouchableOpacity style={styles.wrapBtnContainer} onPress={onUpdate}>
            <Text style={[styles.subTitle, {color: COLORS.WHITE_FBF8CC}]}>
              Cập nhật
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
    borderRadius: 32,
    padding: 16,
    backgroundColor: COLORS.WHITE_FBF8CC,
    width: '90%',
    zIndex: 999,
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
    alignItems: 'center',
  },
  wrapContentContainer: {
    paddingHorizontal: 48,
  },
  wrapBtnContainer: {
    borderRadius: 46,
    backgroundColor: COLORS.YELLOW_F2B559,
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  wrapImageContainer: {
    position: 'absolute',
    width: '100%',
    height: 200,
    top: -130,
  },
  title: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    textAlign: 'center',
    color: COLORS.GREEN_4CB572,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
  },
});

export default ForceUpdateAppPopup;
