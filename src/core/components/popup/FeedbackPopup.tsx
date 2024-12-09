import React, {useCallback, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import IconCry from 'assets/svg/IconCry';
import IconLike from 'assets/svg/IconLike';
import IconLove from 'assets/svg/IconLove';
import IconNormal from 'assets/svg/IconNormal';
import IconSad from 'assets/svg/IconSad';
import {assets} from 'src/core/presentation/utils';

interface FeedbackPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: string) => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  isVisible,
  onClose,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const onSent = useCallback(() => {}, []);

  const icons = [
    {id: 'cry', component: IconCry},
    {id: 'sad', component: IconSad},
    {id: 'normal', component: IconNormal},
    {id: 'like', component: IconLike},
    {id: 'love', component: IconLove},
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.contentContainer}>
          <View style={{marginTop: 80}}>
            <Text style={styles.title}>
              phản hồi ý kiến của bạn{'\n'} để nhận
              <Text style={{color: COLORS.RED_F28759}}>
                {' '}
                miễn phí 50 kim cươngs
              </Text>
            </Text>
            <TextInput
              placeholder="App dùng ổn :3"
              style={styles.textInputContainer}
              multiline
              onChangeText={e => setFeedback(e)}
            />
            <View style={styles.iconContainer}>
              {icons.map(({id, component: Icon}) => {
                console.log('id: ', id === selectedIcon);
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => setSelectedIcon(id)}>
                    <Icon fill={selectedIcon === id ? '#F2CA30' : undefined} />
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.sentBtnContainer} onPress={onSent}>
              <Text style={styles.btnTitle}>Gửi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.wrapImageContainer}>
            <Image
              source={assets.feedbackImage}
              resizeMode="contain"
              style={{height: '100%', width: '100%'}}
            />
          </View>
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
    padding: 32,
  },
  contentContainer: {
    borderRadius: 32,
    padding: 16,
    backgroundColor: COLORS.WHITE_FBF8CC,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    color: COLORS.GREEN_4CB572,
  },
  textInputContainer: {
    borderRadius: 16,
    backgroundColor: COLORS.GREEN_DDF598,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginVertical: 24,
    minHeight: 108,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sentBtnContainer: {
    borderRadius: 46,
    backgroundColor: COLORS.YELLOW_F2B559,
    paddingVertical: 16,
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
  },
});

export default FeedbackPopup;
