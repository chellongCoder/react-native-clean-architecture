import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import {assets} from 'src/core/presentation/utils';

const ReceivedDiamondPopup = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.wrapImageContainer}>
            <Image
              source={assets.diamond_amount} // Update the path as necessary
              style={styles.diamondImage}
            />
          </View>
          <View style={{marginTop: 50}}>
            <Text style={styles.title}>bạn đã nhận được{'\n'}50 kim cương</Text>
            <Text
              style={{
                fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
              }}>
              Cảm ơn bạn đã phản hồi ý kiến.{'\n'}Bạn đã nhận được 50 kim cương
            </Text>
            <TouchableOpacity style={styles.sentBtnContainer} onPress={onClose}>
              <Text style={styles.btnTitle}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ReceivedDiamondPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    paddingHorizontal: 32,
  },
  modalView: {
    margin: 20,
    width: '100%',
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  diamondImage: {
    width: 150, // Adjust size as needed
    height: 150, // Adjust size as needed
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalTextSmall: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    color: COLORS.GREEN_4CB572,
  },
  sentBtnContainer: {
    borderRadius: 46,
    backgroundColor: COLORS.YELLOW_F2B559,
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 32,
  },
  btnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitBold,
    color: COLORS.WHITE_FBF8CC,
  },
  wrapImageContainer: {
    position: 'absolute',
    width: '100%',
    height: 200,
    top: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReceivedDiamondPopup;
