import React, {useCallback, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
} from 'react-native';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TYPOGRAPHY} from 'src/core/presentation/constants/typography';
import IconCry from 'assets/svg/IconCry';
import IconLike from 'assets/svg/IconLike';
import IconLove from 'assets/svg/IconLove';
import IconNormal from 'assets/svg/IconNormal';
import IconSad from 'assets/svg/IconSad';
import {assets} from 'src/core/presentation/utils';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import Toast from 'react-native-toast-message';
import {scale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';

interface FeedbackPopupProps {
  isVisible: boolean;
  onClose: ({
    isShowFeedBack,
    isShowReceived,
  }: {
    isShowFeedBack: boolean;
    isShowReceived: boolean;
  }) => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({isVisible, onClose}) => {
  const icons = [
    {id: 'cry', component: IconCry},
    {id: 'sad', component: IconSad},
    {id: 'normal', component: IconNormal},
    {id: 'like', component: IconLike},
    {id: 'love', component: IconLove},
  ];

  const [feedback, setFeedback] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(icons[4]?.id);

  const globalStyle = useGlobalStyle();
  const {handlePostReport} = useAuthenticationStore();
  const loading = useLoadingGlobal();
  const onSent = useCallback(async () => {
    if (feedback.trim().length > 10 && selectedIcon) {
      try {
        loading.toggleLoading(true, 'LoadingFeedback');
        const params = {
          content: feedback,
          react: selectedIcon,
          image: 'https://example.com/image.jpg',
        };
        const res = await handlePostReport(params);
        if (res) {
          onClose({isShowFeedBack: false, isShowReceived: true});
        }
      } catch (error) {
        console.log('post report fail: ', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Gửi phản hồi thất bại',
        });
      } finally {
        loading.toggleLoading(false, 'LoadingFeedback');
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          'content need to be more than 10 characters long and icon need to be selected',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, handlePostReport, onClose, selectedIcon]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      style={{height: 500, width: '100%'}}
      onRequestClose={() =>
        onClose({isShowFeedBack: false, isShowReceived: false})
      }>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          onClose({isShowFeedBack: false, isShowReceived: false});
        }}
        style={styles.centeredView}
      />
      <View
        onTouchMove={e => {
          Keyboard.dismiss();
        }}
        style={styles.contentContainer}>
        <TouchableOpacity activeOpacity={1}>
          <View style={{marginTop: 80}}>
            <Text style={styles.title}>
              SEND US YOUR FEEDBACK{'\n'}AND RECEIVE
              <Text style={{color: COLORS.RED_F28759}}> 50 DIAMONDS FREE</Text>
            </Text>
            <Text
              style={[
                globalStyle.txtNote,
                {fontStyle: 'italic', color: COLORS.YELLOW_F2B559},
              ]}>
              * Comment need to be more than 10 characters long
            </Text>
            <TextInput
              placeholder="Aa..."
              style={styles.textInputContainer}
              multiline
              onChangeText={e => setFeedback(e)}
              autoFocus
            />
            <View style={styles.iconContainer}>
              {icons.map(({id, component: Icon}) => {
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
              <Text style={styles.btnTitle}>Send</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.wrapImageContainer}>
          <Image
            source={assets.feedbackImage}
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
    padding: scale(16),
    backgroundColor: COLORS.WHITE_FBF8CC,
    width: '90%',
    zIndex: 999,
    position: 'absolute',
    alignSelf: 'center',
    top: '20%',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.FAMILY.SVNCherishMoment,
    color: COLORS.GREEN_4CB572,
  },
  textInputContainer: {
    borderRadius: scale(16),
    backgroundColor: COLORS.GREEN_DDF598,
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    marginBottom: scale(24),
    marginTop: scale(5),
    minHeight: scale(108),
    textAlignVertical: 'top',
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
