/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {
  forwardRef,
  useCallback,
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
import {darkenColor} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  Easing,
  ReduceMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useLessonStore} from '../../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../../hooks/useSettingLesson';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {observer} from 'mobx-react';
import {LessonRef} from '../../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import SelectionAnswersQuestion, {
  SelectionAnswersQuestionRef,
} from '../../../components/SelectionAnswersQuestion';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../../components/VoiceButton';
import DragItem from '../../../components/Drag/DragSendItem';
import {useDragContext} from '../../../components/Drag/DragProvider';
import FastImage from 'react-native-fast-image';
import TextHighlight from '../../../components/TextHighlight';
import {useHistoryModule} from './hook';

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

const HistoryHS6M1P3 = observer(
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

      const answerRef = useRef<SelectionAnswersQuestionRef>(null);

      const {clear, listDragItem} = useDragContext();

      const [answerSelected, setAnswerSelected] = useState('');
      const [isShowAnswerDesc, setIsShowAnswerDesc] = useState(false);

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const {onSpeechText} = useHistoryModule({
        text:
          firstMiniTestTask?.question?.[moduleIndex].instruction.description ??
          '',
      });

      const [isCorrectAnswer, setIsCorrectAnswer] = useState<
        boolean | undefined
      >(undefined);

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
          setIsShowAnswerDesc(true);
          const tout = setTimeout(() => {
            clearTimeout(tout);
            setIsShowAnswerDesc(false);
            nextModule(answerSelected);
          }, 5000);
          answerRef.current?.resetAnswerSelected?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 10,
      });

      const {lessonSetting} = useHomeStore();

      const i18n = useI18n();
      const isSubmitRef = useRef(false);

      const mockData = [
        {
          id: 1,
          question: 'Một thiên niên kỷ bằng bao nhiêu năm?',
          questionImageUrl:
            'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg',
          answer: ['10', '100', '1000', '10000'],
          correctAnswer: '1000',
          answerDescription:
            'Đơn vị thời gian trong lịch sử giúp ta tính khoảng cách giữa các sự kiện. 10 năm gọi là một thập kỉ, 100 năm gọi là một thế kỉ, và 1000 năm gọi là một thiên niên kỉ.',
        },
      ];

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );
      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      const onSubmit = useCallback(() => {
        const selectedFeature = (() => {
          const listFeature = Object.keys(listDragItem).filter(
            (index: string) => listDragItem[+index].parentId >= 0,
          );

          return listFeature
            .filter(e => +e >= 100)
            .map(item => {
              return listDragItem[+item];
            });
        })();

        const correctAnswers =
          firstMiniTestTask?.question?.[moduleIndex].correctAnswer;

        const isCorrect =
          correctAnswers?.toString() === selectedFeature[0]?.value?.toString();

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
            <View
              style={{
                paddingHorizontal: scale(64),
                justifyContent: 'center',
                alignItems: 'center',
                gap: scale(16),
              }}>
              {/* <Image
                source={require('../../../../../../assets/images/historyDefaultImage.png')}
                style={{
                  width: scale(100),
                  height: scale(100),
                }}
              /> */}
              <Text style={[styles.fonts_SVN_Cherish, styles.centerTitle]}>
                {mockData[0].question}
              </Text>
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
              {isShowAnswerDesc ? (
                <View
                  style={[
                    styles.fill,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: COLORS.WHITE_FBF8CC,
                      borderRadius: scale(30),
                      padding: scale(16),
                    },
                  ]}>
                  <View
                    style={[
                      styles.fill,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.PRIMARY,
                        borderRadius: scale(30),
                        padding: scale(16),
                      },
                    ]}>
                    <Text
                      style={[
                        styles.fonts_SVN_Cherish,
                        styles.centerTitle,
                        {color: COLORS.WHITE_FBF8CC, fontSize: scale(14)},
                      ]}>
                      {mockData[0].answerDescription}
                    </Text>
                  </View>
                </View>
              ) : (
                <SelectionAnswersQuestion
                  question={
                    <TextHighlight
                      content={
                        firstMiniTestTask?.question?.[moduleIndex].highlight ??
                        ''
                      }
                      description={
                        firstMiniTestTask?.question?.[moduleIndex].content ?? ''
                      }
                    />
                  }
                  answer={mockData[0].answer}
                  isSelectOne
                  answerStyle={styles.fonts_SVN_Cherish}
                  isShowCorrectContainer={isShowCorrectContainer}
                  isAnswerCorrect={!!isAnswerCorrect}
                  onSelectAnswer={(e: string[]) => {
                    setAnswerSelected(e[0]);
                  }}
                  learningTimer={learningTimer}
                  ref={answerRef}
                />
              )}

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

export default HistoryHS6M1P3;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textColor: {
    color: '#1C6349',
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
    marginHorizontal: scale(20),
    fontSize: verticalScale(18),
    textAlign: 'center',
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.GREEN_157152,
  },

  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },

  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },

  // New styles for the circular container and items
  circularContainer: {
    height: scale(213),
    width: scale(213),
    borderRadius: 999,
    borderWidth: 3,
    borderColor: COLORS.YELLOW_F2B559,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(64),
  },
  centerTitle: {
    fontSize: 25,
    color: COLORS.RED_D36323,
    textAlign: 'center',
  },
  circularItem: {
    width: scale(92),
    height: scale(92),
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: scale(8),
  },
  circularItemText: {
    fontSize: 17,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
  },
  itemTopLeft: {
    top: scale(-30),
    left: scale(0),
  },
  itemBottomLeft: {
    top: scale(138),
    left: scale(0),
  },
  itemRight: {
    top: scale(46),
    right: scale(-46),
  },

  // Content display styles
  contentRow: {
    flexDirection: 'row',
    padding: scale(8),
    gap: 8,
  },
  imageContainer: {
    width: '50%',
    borderWidth: 3,
    borderRadius: scale(16),
    borderColor: COLORS.YELLOW_F2B559,
    height: scale(180),
  },
  descriptionContainer: {
    width: '50%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: scale(16),
    padding: scale(8),
    justifyContent: 'center',
  },
  descriptionText: {
    color: COLORS.WHITE_FBF8CC,
    fontSize: scale(14),
    textAlign: 'center',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: scale(32),
  },
  placeholderText: {
    fontSize: 25,
    color: COLORS.BLUE_258F78,
    textAlign: 'center',
  },
});
