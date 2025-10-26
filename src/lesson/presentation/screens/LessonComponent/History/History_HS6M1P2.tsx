import {StyleSheet, Text, View} from 'react-native';
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
import LessonComponent from '../LessonComponent';
import PrimaryButton from '../../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import {COLORS} from 'src/core/presentation/constants/colors';
import {
  darkenColor,
  getCorrectAnswer,
  WIDTH_SCREEN,
} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  Easing,
  ReduceMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useLessonStore} from '../../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {SelectionAnswersQuestionRef} from '../../../components/SelectionAnswersQuestion';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../../components/VoiceButton';
import DragItem from '../../../components/Drag/DragSendItem';
import {useDragContext} from '../../../components/Drag/DragProvider';
import FastImage from 'react-native-fast-image';
import TextHighlight from '../../../components/TextHighlight';
import { useHistoryModule } from './hook';

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
};

const History_HS6M1P2 = observer(
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
      },
      ref,
    ) => {
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
      const focus = useIsFocused();
      const answerRef = useRef<SelectionAnswersQuestionRef>();

      const {clear, listDragItem} = useDragContext();

      const [answerSelected, setAnswerSelected] = useState('');

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const [isCorrectAnswer, setIsCorrectAnswer] = useState<
        boolean | undefined
      >(undefined);
      // console.log(
      //   '🛠 LOG: 🚀 --> --------------------------------------------------🛠 LOG: 🚀 -->',
      // );
      // console.log('🛠 LOG: 🚀 --> ~ isCorrectAnswer:', isCorrectAnswer);
      // console.log(
      //   '🛠 LOG: 🚀 --> --------------------------------------------------🛠 LOG: 🚀 -->',
      // );
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
        isCorrectAnswer: isCorrectAnswer,
        onSubmit: () => {
          clear();
          setAnswerSelected('');
          setIsCorrectAnswer(undefined);
          nextModule(answerSelected);
          answerRef.current?.resetAnswerSelected?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 5 * 60,
      });

      const {lessonSetting} = useHomeStore();

      const i18n = useI18n();
      const isSubmitRef = useRef(false);

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );
      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const {onSpeechText} = useHistoryModule({
        text:
          getCorrectAnswer(
            firstMiniTestTask?.question?.[moduleIndex]?.instruction
              ?.description ?? '',
          ) ||
          settings.prompt?.toString() ||
          '',
      });
      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      const onSubmit = useCallback(() => {
        const selectedFeature = (() => {
          const listFeature = Object.keys(listDragItem).filter(
            (index: string) => listDragItem[+index].parentId >= 0,
          );

          return listFeature
            .filter(e => +e < 100)
            .map(item => {
              return listDragItem[listDragItem[+item].parentId];
            });
        })();

        const correctAnswers = firstMiniTestTask?.question?.[moduleIndex]
          .correctAnswer;

        const isCorrect =
          correctAnswers?.toString().toLocaleLowerCase() ===
          selectedFeature.map(e => e.value).join('/').toLocaleLowerCase();

        setIsCorrectAnswer(!!isCorrect);
        isSubmitRef.current = false;
      }, [listDragItem, firstMiniTestTask?.question, moduleIndex]);

      /**
       * * submit khi đúng
       */
      useEffect(() => {
        if (isCorrectAnswer !== undefined) {
          submit();
        }
      }, [isCorrectAnswer, submit]);

      /**
       * * reset lại countdown khi lần làm thay đổi
       */
      useEffect(() => {
        resetLearning();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [trainingCount]);

     

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

      useImperativeHandle(ref, () => ({
        isAnswerCorrect,
        onChoiceCorrectedAnswer: () => {
          answerRef.current?.handleSelectAnswer?.(
            firstMiniTestTask?.question?.[moduleIndex].correctAnswer as string,
          );
        },
      }));

      const buildItemAnswer = useCallback(
        (items: string[], item: string, index: number) => {
          // console.log('🛠 LOG: 🚀 --> ~ item:', item);
          return (
            <DragItem
              index={100 + index}
              value={item}
              canSwap={false}
              createItem={({value}) => {
                return (
                  <View style={{
                    borderWidth: 2,
                    borderColor: COLORS.YELLOW_E6960B,
                    paddingHorizontal: scale(6),
                    padding: scale(10),
                    borderRadius: 12,
                    width: (WIDTH_SCREEN - scale(100)) / 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={styles.textAnswer}>{value}</Text>
                  </View>
                );
              }}
            />
          );
        },
        [],
      );

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          lessonName={lessonName}
          module={moduleName}
          part={firstMiniTestTask?.name}
          backgroundColor="#66c270"
          backgroundAnswerColor={
            settings.backgroundAnswerColor ?? COLORS.GREEN_DDF598
          }
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              description: settings.prompt?.toString() ?? '',
            }
          }
          price="Free"
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
          buildQuestion={
            <View style={{
              alignItems: 'center',
              maxWidth: '50%',
            }}>
              <Text style={styles.textQuestion}>
                {
                  firstMiniTestTask?.question?.[moduleIndex].description
                }
              </Text>
              <Text style={styles.textDes}>
                {
                  firstMiniTestTask?.question?.[moduleIndex].descriptionImage
                }
              </Text>
              <View style={{
                flexDirection: 'row',
              }}>
                {(firstMiniTestTask?.question?.[moduleIndex].image as string[])
                  .map((item, index) => {
                    return <View key={index} style={{width: scale(120), marginHorizontal: scale(6)}}>
                        
                        {<DragItem
                            key={item + index}
                            index={index}
                            value={item}
                            createItem={({value}) => {
                              return <View
                              style={{
                                width: scale(120),
                                minHeight: scale(100),
                                marginTop: verticalScale(20),
                                backgroundColor: COLORS.WHITE_FBF8CC,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderRadius: 12,
                                borderStyle: 'dashed',
                                borderColor: COLORS.YELLOW_E6960B,
                                overflow: 'hidden',
                              }}>
                                {
                                  value != item ? 
                                  <View style={{paddingHorizontal: 4, paddingVertical: 6}}>
                                    <Text style={styles.textAnswer}>{value}</Text>
                                  </View>
                                  : (
                                    <FastImage
                                      source={{
                                        uri: env?.IMAGE_QUESTION_BASE_API_URL + value,
                                      }}
                                      style={{
                                        width: scale(120),
                                        height: scale(100),
                                      }}
                                    />
                                  )
                                }
                              </View>
                              }}
                          />}
 
                    </View>
                  })
                }
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
                    {i18n.t('lesson.screens.Modules.chooseCorrectAnswer')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>

              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: COLORS.WHITE_FBF8CC,
                  minHeight: verticalScale(180),
                  borderRadius: scale(10),
                  padding: scale(10),
                }}>
                  <TextHighlight
                    content={
                      firstMiniTestTask?.question?.[moduleIndex].highlight ?? ''
                    }
                    description={
                      firstMiniTestTask?.question?.[moduleIndex].content ?? ''
                    }
                  />
                <View
                  style={{
                    marginTop: verticalScale(10),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                  }}
                >
                  {(
                    firstMiniTestTask?.question?.[moduleIndex]
                      .answers as string[]
                  ).map((item, index) => {
                    return (
                      <View style={{
                        flex: 1,
                        marginTop: verticalScale(10),
                        alignItems: 'center',
                      }}>
                        {buildItemAnswer([], item, index + 100)}
                      </View>
                    );
                  })}
                </View>
              </View>

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={onSubmit}
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

export default History_HS6M1P2;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
   
  textParagraph: {
    fontSize: verticalScale(26),
    textAlign: 'center',
    color: COLORS.WHITE_FBF8CC,
    textShadowColor: COLORS.YELLOW_F2B559,
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
  },
  textQuestion: {
    marginTop: verticalScale(6),
    marginHorizontal: scale(14),
    fontSize: verticalScale(18),
    textAlign: 'center',
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.ORANGE_E5592C,
  },
  textDes: {
    fontSize: verticalScale(18),
    fontFamily: FontFamily.SVNNeuzeitBold,
    color: COLORS.GREEN_009C6F,
    textAlign: 'center',
  },
  textAnswer: {
    fontSize: verticalScale(14),
    textAlign: 'center',
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.YELLOW_E6960B,
  },
   
   
   wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  iconImageContainer: {
    height: verticalScale(45),
    width: verticalScale(40),
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
});
