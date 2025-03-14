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
import {getCorrectAnswer, WIDTH_SCREEN} from 'src/core/presentation/utils';
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
import {SelectionAnswersQuestionRef} from '../../components/SelectionAnswersQuestion';
import KeyboardNumber from '../../components/KeyboardNumber';
import {useI18n} from 'src/core/presentation/hooks/useI18n';

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

const Math_MG6M15 = observer(
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
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
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
        isCorrectAnswer:
          (typeof answerSelected === 'object' &&
            (answerSelected as string[]).join('')) ===
          getCorrectAnswer(
            firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer,
          ),
        onSubmit: () => {
          setAnswerSelected(isMulti ? [] : '');
          answerRef.current?.resetAnswerSelected?.();
          nextModule((answerSelected as string[]).join(''));
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 30,
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
        const contentWords =
          firstMiniTestTask?.question?.[moduleIndex]?.content?.split(' ');

        if (answerSelected?.length > 0 && contentWords) {
          const lastWord = contentWords[contentWords.length - 1] ?? '';

          if (firstMiniTestTask?.question?.[moduleIndex].isAcreage) {
            const baseWord = lastWord.slice(0, -1);
            return (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.fonts_SVN_Cherish,
                    styles.textQuestion,
                    {fontSize: 40},
                  ]}>
                  {Array.isArray(answerSelected)
                    ? answerSelected.join('')
                    : answerSelected}
                </Text>

                <Text
                  style={[
                    styles.fonts_SVN_Cherish,
                    styles.textQuestion,
                    {fontSize: 40},
                  ]}>
                  {baseWord}
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 999,
                    right: -10,
                    bottom: 30,
                  }}>
                  <Text
                    style={[
                      styles.fonts_SVN_Cherish,
                      styles.textQuestion,
                      {fontSize: 20},
                    ]}>
                    2
                  </Text>
                </View>
              </View>
            );
          }

          return (
            <>
              {Array.isArray(answerSelected)
                ? answerSelected.join('')
                : answerSelected}
              {lastWord}
            </>
          );
        }
        const content =
          firstMiniTestTask?.question?.[moduleIndex]?.content ?? '';

        if (firstMiniTestTask?.question?.[moduleIndex].isAcreage) {
          // Use regular expression to match cm2, m2, dm2, etc.
          const updatedContent = content.split(' ').map((word, index) => {
            // If the word ends with '2', check if it's a unit like cm2, m2, or dm2
            const match = word.match(/([a-zA-Z]+)(2)$/);
            if (match) {
              const unit = match[1]; // Get the unit part like 'cm', 'm', 'dm'
              return (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.fonts_SVN_Cherish,
                      styles.textQuestion,
                      {fontSize: 40},
                    ]}>
                    {unit}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 999,
                      right: -10,
                      bottom: 30,
                    }}>
                    <Text
                      style={[
                        styles.fonts_SVN_Cherish,
                        styles.textQuestion,
                        {fontSize: 20},
                      ]}>
                      2
                    </Text>
                  </View>
                </View>
              );
            }
            return <Text key={index}>{word} </Text>;
          });

          return <>{updatedContent}</>; // Return the mapped and updated content
        } else {
          return content;
        }
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction
            ?.description ?? '',
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
      console.log(
        'firstMiniTestTask?.question?.[moduleIndex]: ',
        firstMiniTestTask?.question?.[moduleIndex],
      );
      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
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
            word?.toString() ===
            firstMiniTestTask?.question?.[moduleIndex].correctAnswer
              ? undefined
              : word
          }
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          characterStyle={{
            height: verticalScale(300),
            marginBottom: -verticalScale(130),
            marginLeft: -scale(40),
          }}
          buildQuestion={
            <View>
              <Animated.Image
                resizeMode={'contain'}
                width={WIDTH_SCREEN}
                height={scale(200)}
                style={[{}, animatedStyle]}
                source={{
                  uri:
                    env.IMAGE_QUESTION_BASE_API_URL +
                    firstMiniTestTask?.question?.[moduleIndex].image,
                }}
              />
              <View style={styles.wrapQuestionContainer}>
                <Text
                  style={[
                    styles.fonts_SVN_Neu,
                    {
                      fontSize: 11,
                      fontWeight: 'bold',
                      color: COLORS.BLUE_1F78A9,
                    },
                  ]}>
                  {firstMiniTestTask?.question?.[
                    moduleIndex
                  ]?.instruction?.description.toString()}
                </Text>
              </View>
            </View>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View
                  style={{
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text style={[globalStyle.txtLabel, styles.textColor]}>
                    {i18n.t('lesson.screens.Modules.typeCorrectAnswer')}
                  </Text>
                </View>

                <TouchableOpacity onPress={onSpeechText}>
                  <Image
                    source={require('../../../../../assets/images/icon_speech.png')}
                    style={styles.iconImageContainer}
                  />
                </TouchableOpacity>
              </View>
              <KeyboardNumber
                question={
                  <View
                    style={
                      !firstMiniTestTask?.question?.[moduleIndex].isAcreage
                        ? [
                            styles.wrapAnswerContainer,
                            {
                              borderColor:
                                firstMiniTestTask?.question?.[moduleIndex]
                                  ?.color,
                            },
                          ]
                        : [
                            styles.wrapAreaAnswerContainer,
                            {
                              backgroundColor:
                                firstMiniTestTask?.question?.[moduleIndex]
                                  ?.color,
                            },
                          ]
                    }>
                    <Text
                      style={[
                        styles.fonts_SVN_Cherish,
                        styles.textQuestion,
                        {fontSize: 40},
                      ]}>
                      {descriptionWithAnswers}
                    </Text>
                  </View>
                }
                answer={answer ?? []}
                isShowCorrectContainer={isShowCorrectContainer}
                isAnswerCorrect={!!isAnswerCorrect}
                onSelectAnswer={(e: string[]) => {
                  setAnswerSelected(e);
                }}
                learningTimer={learningTimer}
                ref={answerRef}
                isKeyboard={true}
              />

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: lessonSetting?.backgroundButtonColor},
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

export default Math_MG6M15;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_SVN_Neu: {
    fontFamily: FontFamily.SVNNeuzeitBold,
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
    color: COLORS.BLUE_0877B6,
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
  iconImageContainer: {height: 45, width: 40},
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
  wrapAnswerContainer: {
    borderRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.BLUE_4552C8,
    padding: 16,
  },
  wrapAreaAnswerContainer: {
    backgroundColor: COLORS.BLUE_93F6E1,
    padding: 16,
    borderRadius: 16,
  },
  wrapQuestionContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: COLORS.WHITE_FBF8CC,
    marginTop: 16,
    alignSelf: 'flex-start',
    marginLeft: 110,
  },
});
