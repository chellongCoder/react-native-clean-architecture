import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {assets} from 'src/core/presentation/utils';

const FeedbackPopup = ({isVisible, onClose, onSubmitFeedback}) => {
  const [feedback, setFeedback] = useState('');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={assets.bee_x50} // Update the path as necessary
            style={styles.beeImage}
          />
          <Text style={styles.modalText}>PHẢN HỒI Ý KIẾN CỦA BẠN</Text>
          <Text style={styles.modalTextSmall}>
            Để nhận miễn phí 50 kim cương
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setFeedback}
            value={feedback}
            placeholder="App dùng ổn :)"
            multiline
          />
          <View style={styles.reactionContainer}>
            {/* Add reaction icons here */}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onSubmitFeedback(feedback)}>
            <Text style={styles.buttonText}>Gửi</Text>
          </TouchableOpacity>
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalTextSmall: {
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  input: {
    marginBottom: 20,
    width: 250,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  reactionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
  beeImage: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    marginBottom: 20,
  },
});

export default FeedbackPopup;
