import React, {View, Text, StyleSheet} from 'react-native';
import {RootStackScreenProps} from '../navigation/types';
import useGlobalStyle from '../hooks/useGlobalStyle';

export default function DoneLessonScreen({
  navigation,
}: RootStackScreenProps<'NotFound'>) {
  const styleHook = useGlobalStyle();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.text, styleHook.txtWord]}>
          EXCELLENT !!{'\n'} YOU DID GREAT WORK !
        </Text>
        <Text style={[styles.subText, styleHook.txtLabel]}>
          Your score {'\n'}10/10
        </Text>
      </View>
      <View style={styles.achievementContainer}>
        <View style={styles.achievementBorder}>
          <View style={styles.borderTopLeft} />
          <View style={styles.borderTopRight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBF8CC',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    height: '100%',
    width: '100%',
  },
  text: {
    fontWeight: '400',
    fontSize: 40,
    textAlign: 'center',
    color: '#F2B559',
    marginTop: '50%',
  },
  subText: {
    fontWeight: '400',
    fontSize: 20,
    textAlign: 'center',
    color: '#258F78',
    marginTop: 30,
  },
  achievementContainer: {
    backgroundColor: '#FFD75A',
    width: '100%',
    minHeight: '50%',
    position: 'relative',
  },
  achievementBorder: {
    top: -50,
    left: 0,
    width: '100%',
    position: 'absolute',

    flexDirection: 'row',
    height: 100,
  },
  borderTopLeft: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 30,
    backgroundColor: '#FFD75A',
    width: '50%',
  },
  borderTopRight: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 50,
    backgroundColor: '#FFD75A',
    width: '50%',
  },
});
