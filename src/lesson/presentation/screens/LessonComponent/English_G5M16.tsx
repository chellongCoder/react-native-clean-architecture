import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {
  darkenColor,
  getCorrectAnswer,
  isSubArray,
} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

import SelectionTextsQuestion, {
  SelectionTextsQuestionRef,
} from '../../components/SelectionTextsQuestion';
import TextHighlight from '../../components/TextHighlight';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import Tts from 'react-native-tts';
import {
  iosVoice,
  listLanguage,
} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import {isAndroid} from 'src/core/presentation/utils';
import ScrollIndicator from '../../components/ScrollIndicator';

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
  isMulti?: boolean;
  answer?: string[];
};

const English_G5M16 = observer(
  forwardRef<LessonRef, Props>(
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
        isMulti,
        answer,
      },
      ref,
    ) => {
      const answerRef = useRef<SelectionTextsQuestionRef>(null);
      const globalStyle = useGlobalStyle();

      const {ttsSpeak, updateDefaultVoice} = useContext(TextToSpeechContext);
      const focus = useIsFocused();

      const [answerSelected, setAnswerSelected] = useState<string | string[]>(
        '',
      );
      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const {
        isAnswerCorrect,
        isShowCorrectContainer,
        word,
        env,
        learningTimer,
        submit,
        toggleShowHint,
        resetLearning,
      } = useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: isSubArray(
          answerSelected as string[],
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer as string[],
        ),
        onSubmit: () => {
          setAnswerSelected(isMulti ? [] : '');
          answerRef.current?.resetAnswerSelected?.();

          nextModule((answerSelected as string[]).join(''));
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
      });

      const {lessonSetting} = useHomeStore();

      const i18n = useI18n();

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );
      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const descriptionWithAnswers = useMemo(() => {
        const insertAnswersIntoDescription = (
          description: string,
          answers: string[],
        ) => {
          let answerIndex = 0;
          return description.replace(/_/g, () =>
            answerIndex < answers.length ? answers[answerIndex++] : '_',
          );
        };
        const description =
          firstMiniTestTask?.question?.[moduleIndex].description || '';
        const updatedDescription = insertAnswersIntoDescription(
          description,
          answerSelected as string[],
        );
        return updatedDescription;
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.description
            ?.toString()
            .toLowerCase() ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      /**
       * * reset lại countdown khi lần làm thay đổi
       */
      useEffect(() => {
        resetLearning();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [trainingCount]);

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
        scaleS.value = withTiming(0, {duration: 500}, () => {
          scaleS.value = withTiming(1, {
            duration: 500,
            easing: Easing.elastic(2),
            reduceMotion: ReduceMotion.System,
          });
        });
      }, [moduleIndex, opacity, scaleS]);

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
          transform: [{scale: scaleS.value}],
        };
      });

      useEffect(() => {
        Tts.voices().then(voices => {
          if (lessonName.toLocaleLowerCase().includes('english')) {
            const engVoice = voices.find(
              voice => voice.language === listLanguage['US English'],
            );
            updateDefaultVoice?.(
              isAndroid ? engVoice?.id : iosVoice[3].id,
              'US English',
            );
          } else if (lessonName.toLocaleLowerCase().includes('mandarin')) {
            const engVoice = voices.find(
              voice =>
                voice.language ===
                listLanguage['Mainland China, simplified characters'],
            );
            updateDefaultVoice?.(
              engVoice?.id,
              'Mainland China, simplified characters',
            );
          } else if (lessonName.toLocaleLowerCase().includes('tiếng việt')) {
            const vietnameseVoices = voices.filter(
              voice =>
                voice.language.startsWith('vi-') ||
                voice.name.toLowerCase().includes('vietnamese'),
            );

            updateDefaultVoice?.(vietnameseVoices[0]?.id, 'Vie (Vietnamese)');
          }
        });
      }, [lessonName, updateDefaultVoice]);

      useImperativeHandle(ref, () => ({
        isAnswerCorrect,
        onChoiceCorrectedAnswer: () => {
          setAnswerSelected(
            getCorrectAnswer(
              firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
            ),
          );
        },
      }));

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          characterStyle={{
            marginBottom: -verticalScale(60),
            marginLeft: -verticalScale(15),
            transform: [{scale: 1.4}],
          }}
          module={moduleName}
          lessonName={lessonName}
          part={firstMiniTestTask?.name}
          backgroundColor={settings.backgroundAnswerColor}
          backgroundAnswerColor={settings.backgroundAnswerColor}
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              description: settings.prompt?.toString() ?? '',
            }
          }
          score={selectedChild?.adsPoints}
          txtCountDown={
            (
              firstMiniTestTask?.question?.[moduleIndex]
                .correctAnswer as string[]
            ).includes((word as string)?.toLocaleLowerCase())
              ? undefined
              : word
          }
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <ScrollIndicator
              horizontal={false}
              containerStyle={{marginHorizontal: scale(20)}}>
              <Text style={styles.txtParagraph}>
                {firstMiniTestTask?.question?.[moduleIndex].paragraph}
              </Text>
            </ScrollIndicator>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text
                    style={[
                      globalStyle.txtLabel,
                      {
                        color: darkenColor(
                          settings.backgroundButtonColor ?? '',
                          20,
                        ),
                      },
                    ]}>
                    {i18n.t('lesson.screens.Modules.chooseTheCorrectWord')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>
              <SelectionTextsQuestion
                question={
                  <TextHighlight
                    style={{textAlign: 'center'}}
                    content={
                      firstMiniTestTask?.question?.[moduleIndex].content ?? ''
                    }
                    description={descriptionWithAnswers}
                  />
                }
                answer={answer ?? []}
                isShowCorrectContainer={isShowCorrectContainer}
                isAnswerCorrect={!!isAnswerCorrect}
                onSelectAnswer={(e: string[]) => {
                  setAnswerSelected(e);
                }}
                learningTimer={learningTimer}
                ref={answerRef}
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

export default English_G5M16;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_SVN_Neu: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
  },
  textColor: {
    color: '#1C6349',
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: verticalScale(34),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
    marginHorizontal: scale(10),
  },
  textGreen: {
    color: COLORS.BLUE_258F78,
  },
  txtWhite: {
    color: 'white',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pr16: {
    paddingRight: 16,
  },
  ph24: {
    paddingHorizontal: 24,
  },
  pb8: {
    paddingBottom: verticalScale(8),
  },
  pb16: {
    paddingBottom: verticalScale(16),
  },
  pb32: {
    paddingBottom: verticalScale(32),
  },
  mt8: {
    marginTop: verticalScale(8),
  },
  mt16: {
    marginTop: verticalScale(16),
  },
  mt24: {
    marginTop: verticalScale(24),
  },
  mt32: {
    marginTop: verticalScale(32),
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxItemAnswer: {
    height: 94,
    backgroundColor: '#F2B559',
    borderRadius: 30,
  },
  boxSelected: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxVowel: {
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 6,
  },
  textVowel: {
    fontFamily: FontFamily.SVNCherishMoment,
    color: '#FBF8CC',
    fontSize: verticalScale(28),
  },
  wapper: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    flexWrap: 'wrap', // Add this to enable wrapping
  },
  wrapCharContainer: {
    flexDirection: 'row',
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconImageContainer: {height: 39, width: 34},
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
  txtParagraph: {
    fontFamily: FontFamily.SVNNeuzeitBold,
    fontSize: scale(14),
    color: COLORS.WHITE_FBF8CC,
  },
});
