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
import { scale } from 'react-native-size-matters';

const ReceivedDiamondPopup = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: ({isShowFeedBack, isShowReceived} : {isShowFeedBack: boolean, isShowReceived: boolean}) => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onClose({isShowFeedBack: false, isShowReceived: false})}>
      <TouchableOpacity activeOpacity={1} onPress={() => onClose({isShowFeedBack: false, isShowReceived: false})} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.wrapImageContainer}>
            <Image
              source={assets.diamond_amount} // Update the path as necessary
              style={styles.diamondImage}
            />
          </View>
          <View style={{marginTop: 50}}>
            <Text style={styles.title}>YOU GOT{'\n'}50 DIAMONDS</Text>
            <Text
              style={{
                fontFamily: TYPOGRAPHY.FAMILY.SVNNeuzeitRegular,
                textAlign: 'center',
                color: COLORS.BLUE_1C6349
              }}>
              Thank you for your feedback.
              You received 50 diamonds.
            </Text>
            <TouchableOpacity style={styles.sentBtnContainer} onPress={() => onClose({isShowFeedBack: false, isShowReceived: false})}>
              <Text style={styles.btnTitle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
    paddingHorizontal: scale(32),
  },
  modalView: {
    margin: scale(20),
    width: '100%',
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(20),
    padding: scale(35),
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
    width: scale(150), // Adjust size as needed
    height: scale(150), // Adjust size as needed
    marginBottom: scale(20),
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
