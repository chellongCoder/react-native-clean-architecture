import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useCallback} from 'react';
import ICBook from 'src/core/components/icons/ICBook';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';
import Button from './Button';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  // ScreenTimeComponent,
  selectedAppsData,
  sentEvent,
} from 'react-native-alphadex-screentime';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';

type Props = {
  isFinished: boolean;
  title: string;
  subTitle: string;
  progress: number;
  totalQuestion: number;
  id: string;
  lessonName?: string;
  image?: string;
};
const ModuleItem = (props: Props) => {
  const globalStyle = useGlobalStyle();
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const onRevision = useCallback(() => {
    navigateScreen(STACK_NAVIGATOR.HOME.LESSON, {
      lessonId: props.id,
      lessonName: props.lessonName,
      moduleName: props.title,
    });
  }, [props.id, props.lessonName, props.title]);

  const onStudy = useCallback(() => {
    navigateScreen(STACK_NAVIGATOR.HOME.LESSON, {
      lessonId: props.id,
      lessonName: props.lessonName,
      moduleName: props.title,
    });
  }, [props.id, props.lessonName, props.title]);

  const renderIcon = () =>
    props?.image ? (
      <Image
        source={{uri: env.IMAGE_MODULE_BASE_API_URL + props?.image}}
        style={styles.icon}
        resizeMode="contain"
      />
    ) : (
      <ICBook width={32} height={25} color={COLORS.WHITE} />
    );

  return !props.isFinished ? (
    <View style={[styles.container, {backgroundColor: COLORS.WHITE_FBF8CC}]}>
      <View style={[globalStyle.rowCenter]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: COLORS.YELLOW_F2B559},
          ]}>
          {renderIcon()}
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
        <Button onPress={onStudy} color={COLORS.GREEN_66C270} title="Study" />
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
          {renderIcon()}
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
        <TouchableOpacity onPress={async () => {}}>
          <Text style={[styles.title, globalStyle.txtLabel]}>
            {props.progress}/{props.totalQuestion}
          </Text>
        </TouchableOpacity>
        <View style={{height: verticalScale(10)}} />

        <Button
          onPress={onRevision}
          color={COLORS.YELLOW_F2B559}
          title="Revision"
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
  icon: {height: '80%', width: '80%'},
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
    maxWidth: scale(120),
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
