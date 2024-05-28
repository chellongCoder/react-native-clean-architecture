import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import ICBook from 'src/core/components/icons/ICBook';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';
import Button from './Button';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  ScreenTimeComponent,
  requestScreenTime,
  selectedAppsData,
} from 'react-native-alphadex-screentime';

type Props = {isFinished: boolean};
const ModuleItem = (props: Props) => {
  const globalStyle = useGlobalStyle();

  const onDoHomework = useCallback(async () => {
    await requestScreenTime();
    const apps = await selectedAppsData();
    console.log(
      '🛠 LOG: 🚀 --> -------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log('🛠 LOG: 🚀 --> ~ onDoHomework ~ apps:', apps);
    console.log(
      '🛠 LOG: 🚀 --> -------------------------------------------🛠 LOG: 🚀 -->',
    );
  }, []);
  return props.isFinished ? (
    <View style={[styles.container, {backgroundColor: COLORS.WHITE_FBF8CC}]}>
      <View style={[globalStyle.rowCenter]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: COLORS.YELLOW_F2B559},
          ]}>
          <ICBook width={32} height={25} color={COLORS.WHITE} />
        </View>
        <View style={{width: scale(22)}} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, globalStyle.txtLabel]}>{'title'}</Text>
          <View style={{height: verticalScale(4)}} />
          <Text style={[styles.subtitle, globalStyle.txtNote]}>
            {'subtitle'}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={[styles.title, globalStyle.txtLabel]}>10/10</Text>
        <View style={{height: verticalScale(14)}} />
        <Button color={COLORS.GREEN_66C270} title="Study" />
        <ScreenTimeComponent style={{width: 100, height: 50}} />
      </View>
    </View>
  ) : (
    <View style={[styles.container, {backgroundColor: COLORS.GREEN_66C270}]}>
      <View style={[globalStyle.rowCenter]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: COLORS.WHITE_FBF8CC},
          ]}>
          <ICBook width={32} height={25} color={COLORS.YELLOW_F2B559} />
        </View>
        <View style={{width: scale(22)}} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, globalStyle.txtLabel]}>{'title'}</Text>
          <View style={{height: verticalScale(4)}} />
          <Text style={[styles.subtitle, globalStyle.txtNote]}>
            {'subtitle'}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={onDoHomework}
          color={COLORS.YELLOW_F2B559}
          title="Revision"
        />
        <View style={{height: verticalScale(10)}} />
        <Button color={COLORS.YELLOW_F2B559} title="Done" />
      </View>
    </View>
  );
};

export default ModuleItem;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: 'blue',
    width: scale(60),
    height: scale(60),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: scale(30),
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    color: COLORS.GREEN_1C6349,
  },
  subtitle: {
    color: COLORS.GREEN_1C6349,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
