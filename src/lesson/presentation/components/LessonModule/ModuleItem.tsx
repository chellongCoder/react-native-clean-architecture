import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import ICBook from 'src/core/components/icons/ICBook';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';
import Button from './Button';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  // ScreenTimeComponent,
  requestScreenTime,
  selectedAppsData,
  unBlockApps,
  sentEvent,
} from 'react-native-alphadex-screentime';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';

type Props = {
  isFinished: boolean;
  title: string;
  subTitle: string;
  progress: number;
  totalQuestion: number;
};
const ModuleItem = (props: Props) => {
  const globalStyle = useGlobalStyle();

  const onDoHomework = useCallback(async () => {
    const apps = await selectedAppsData();
    console.log(
      '🛠 LOG: 🚀 --> -------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log('🛠 LOG: 🚀 --> ~ onDoHomework ~ apps:', apps);
    console.log(
      '🛠 LOG: 🚀 --> -------------------------------------------🛠 LOG: 🚀 -->',
    );
  }, []);

  const onRevision = useCallback(() => {
    navigateScreen(STACK_NAVIGATOR.HOME.LESSON);
  }, []);

  return !props.isFinished ? (
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
          <TouchableOpacity
            onPress={() => {
              sentEvent();
            }}>
            <Text
              numberOfLines={2}
              style={[styles.title, globalStyle.txtLabel]}>
              {props.title}
            </Text>
          </TouchableOpacity>
          <View style={{height: verticalScale(4)}} />
          <Text style={[styles.subtitle, globalStyle.txtNote]}>
            {props.subTitle}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={async () => {}}>
          <Text style={[styles.title, globalStyle.txtLabel]}>
            {props.progress}/{props.totalQuestion}
          </Text>
        </TouchableOpacity>
        <View style={{height: verticalScale(14)}} />
        <Button color={COLORS.GREEN_66C270} title="Study" />
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
          <Text numberOfLines={2} style={[styles.title, globalStyle.txtLabel]}>
            {props.title}
          </Text>
          <View style={{height: verticalScale(4)}} />
          <Text style={[styles.subtitle, globalStyle.txtNote]}>
            {props.subTitle}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={onRevision}
          color={COLORS.YELLOW_F2B559}
          title="Revision"
        />
        <View style={{height: verticalScale(10)}} />
        <Button
          onPress={onDoHomework}
          color={COLORS.YELLOW_F2B559}
          title="Done"
        />
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
    maxWidth: 100,
  },
  subtitle: {
    color: COLORS.GREEN_1C6349,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBlockApp: {
    width: scale(70.23),
    height: verticalScale(28),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.GREEN_66C270,
  },
});
