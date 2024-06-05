import React, {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import useGlobalStyle from '../hooks/useGlobalStyle';
import ICStar from 'src/core/components/icons/ICStar';
import {STACK_NAVIGATOR} from '../navigation/ConstantNavigator';
import {resetNavigator} from '../navigation/actions/RootNavigationActions';
import {unBlockApps} from 'react-native-alphadex-screentime';
const DoneLessonScreen = ({navigation}) => {
  const styleHook = useGlobalStyle();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styleHook.txtWord, styles.text]}>
          EXCELLENT !!{'\n'} YOU DID GREAT WORK !
        </Text>
        <Text style={[styleHook.txtLabel, styles.subText]}>
          Your score {'\n'}10/10
        </Text>
      </View>
      <View style={styles.achievementContainer}>
        <View style={styles.achievementBorder}>
          <View style={styles.backgroundLeft} />
          <View style={styles.backgroundRight} />
        </View>
        <View style={styles.achievementContent}>
          <View style={styles.backgroundStar}>
            <ICStar width={108} color={'#FFD75A'} height={103} />
          </View>
          <View style={styles.wrapperContent}>
            <Text style={[styleHook.txtLabel, styles.contentTitle]}>
              Achievement
            </Text>
            <Text style={[styleHook.txtNote, styles.contentDescription]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              Lorem Ipsum has been....
            </Text>
          </View>
          <View style={styles.wrapperDot}>
            <View style={styles.Dot} />
            <Text style={[styleHook.txtButton, styles.numberDot]}>x 5</Text>
          </View>
        </View>
        <View style={styles.wrapperButton}>
          <TouchableOpacity style={styles.button}>
            <Text style={[styleHook.txtButton, styles.textBtn]}>
              Recieve award
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              resetNavigator(STACK_NAVIGATOR.HOME.HOME_SCREEN);
              console.log('isloading true');
              await unBlockApps();
              console.log('isloading false');
            }}
            style={styles.button}>
            <Text style={[styleHook.txtButton, styles.textBtn]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default DoneLessonScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBF8CC',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  titleContainer: {
    height: '50%',
    width: '100%',
  },
  text: {
    fontWeight: '400',
    fontSize: 40,
    textAlign: 'center',
    color: '#F2B559',
    paddingTop: '50%',
  },
  subText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#258F78',
    marginTop: 30,
  },
  achievementBorder: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  backgroundLeft: {
    backgroundColor: '#FFD75A',
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 40,
  },
  backgroundRight: {
    backgroundColor: '#FFD75A',
    flex: 1,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 16,
  },
  boxAnswer: {
    flex: 1,
    padding: 32,
  },
  achievementContainer: {
    width: '100%',
    height: '60%',
    position: 'relative',
    paddingTop: 80,
  },
  achievementContent: {
    backgroundColor: '#FBF8CC',
    borderRadius: 30,
    height: 271,
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
  },
  backgroundStar: {
    backgroundColor: '#66C270',
    width: 138,
    height: 138,
    borderRadius: 100,
    top: -50,
    left: '50%',
    transform: [{translateX: -70}],
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperContent: {
    marginTop: 100,
    marginLeft: 30,
    marginRight: 30,
  },
  contentTitle: {
    fontSize: 15,
    color: '#1C6349',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  contentDescription: {
    fontSize: 8,
    color: '#1C6349',
  },
  wrapperDot: {
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  Dot: {
    width: 39,
    height: 39,
    borderRadius: 100,
    backgroundColor: '#66C270',
  },
  numberDot: {
    fontSize: 15,
    color: '#1C6349',
    fontWeight: 'bold',
  },
  wrapperButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    flexDirection: 'row',
    gap: 30,
  },
  button: {
    backgroundColor: '#66C270',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    height: 28,
  },
  textBtn: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FBF8CC',
  },
});
