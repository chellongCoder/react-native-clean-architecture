import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {isMMSS} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import CharScramble, {CharScrambleRep} from '../../components/CharScramble';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: (e: string) => void;
  lessonName: string;
  moduleName: string;
  firstMiniTestTask?: Task;
  backgroundImage?: string;
  characterImageSuccess?: string;
  characterImageFail?: string;
  characterStyle?: StyleProp<ViewStyle>;
};

const EssayLesson = observer(
  forwardRef(
    (
      {
        moduleIndex,
        nextModule,
        totalModule,
        lessonName,
        moduleName,
        firstMiniTestTask,
        backgroundImage,
        characterImageSuccess,
        characterImageFail,
        characterStyle,
      }: Props,
      ref: React.Ref<any>,
    ) => {
      const globalStyle = useGlobalStyle();

      const [answerSelected, setAnswerSelected] = useState('');

      const opacity = useSharedValue(1);
      const scaleS = useSharedValue(1);
      const {getSetting} = useLessonStore();
      const {selectedChild} = useAuthenticationStore();
      const {lessonSetting} = useHomeStore();

      const i18n = useI18n();

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );
      const {ttsSpeak} = useContext(TextToSpeechContext);

      const charScrambleRep = useRef<CharScrambleRep>(null);

      const {
        isAnswerCorrect,
        isShowCorrectContainer,
        word,
        env,
        learningTimer,
        submit,
      } = useSettingLesson({
        countDownTime: 5,
        isCorrectAnswer:
          answerSelected ===
          firstMiniTestTask?.question?.[moduleIndex]?.fullAnswer,
        onSubmit: () => {
          charScrambleRep.current?.reset();
          nextModule(answerSelected);
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
      });

      const focus = useIsFocused();

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex].correctAnswer
            .toString()
            .toLowerCase() ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      useEffect(() => {
        if (focus) {
          // Check if the component is focused
          const firstTimeout = setTimeout(() => {
            onSpeechText();
          }, 1500);

          return () => clearTimeout(firstTimeout);
        }
      }, [onSpeechText, focus]); // Added focus to the dependency array

      useEffect(() => {
        opacity.value = withTiming(0, {duration: 500}, () => {
          opacity.value = withTiming(1, {duration: 500});
        });
        opacity.value = withTiming(0, {duration: 500}, () => {
          opacity.value = withTiming(1, {duration: 500});
        });
        scaleS.value = withTiming(0, {duration: 500}, () => {
          scaleS.value = withTiming(1, {
            duration: 500,
            easing: Easing.elastic(2),
            reduceMotion: ReduceMotion.System,
          });
        });
      }, [moduleIndex, opacity, scaleS]);

      useImperativeHandle(ref, () => ({
        onSpeechText,
      }));

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
          transform: [{scale: scaleS.value}],
        };
      });
      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          lessonName={lessonName}
          module={moduleName}
          part={firstMiniTestTask?.name}
          backgroundColor="#66c270"
          backgroundAnswerColor={settings.backgroundAnswerColor}
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              description: settings.prompt?.toString() ?? '',
            }
          }
          price="Free"
          score={selectedChild?.adsPoints}
          txtCountDown={!isMMSS(word ?? '') ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          buildQuestion={
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
                {firstMiniTestTask?.type !== 'mini_test'
                  ? firstMiniTestTask?.question?.[moduleIndex].correctAnswer
                  : ' '}
              </Text>
              <Animated.Image
                resizeMode={'contain'}
                style={[
                  {
                    width: scale(200),
                    height: verticalScale(140),
                  },
                  animatedStyle,
                ]}
                source={{
                  uri:
                    env.IMAGE_QUESTION_BASE_API_URL +
                    firstMiniTestTask?.question?.[moduleIndex].image,
                }}
              />
            </View>
          }
          characterStyle={characterStyle}
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text style={[globalStyle.txtLabel, styles.textColor]}>
                    {i18n.t('lesson.screens.Modules.spellTheWords')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>
              <CharScramble
                ref={charScrambleRep}
                content={firstMiniTestTask?.question?.[moduleIndex]?.content}
                listChar={
                  firstMiniTestTask?.question?.[moduleIndex]
                    ?.answers as string[]
                }
                learningTimer={learningTimer}
                onAnswerChanged={setAnswerSelected}
              />

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={submit}
              />
            </View>
          }
          moduleIndex={moduleIndex}
          totalModule={totalModule}
        />
      );
    },
  ),
);

export default EssayLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textColor: {
    color: COLORS.BLUE_1C6349,
  },

  textQuestion: {
    fontSize: verticalScale(34),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  iconImageContainer: {
    height: scale(39),
    width: scale(34),
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
