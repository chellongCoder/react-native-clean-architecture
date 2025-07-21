import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
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
  isMMSS,
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
import {SelectionAnswersQuestionRef} from '../../components/SelectionAnswersQuestion';
import TextHighlight from '../../components/TextHighlight';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import QuestionImageText from '../../components/Science/QuestionImageText';
import SelectionAnswersImage from '../../components/SelectionAnswersImage';
import useStateCustom from 'src/hooks/useStateCommon';

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
  isMultiQuestion?: boolean;
};

type TMultiQuestionAnswerSelected = {
  questionIndex?: number;
  answerSelected?: string[];
  answerHasSelected?: string[];
};

const Science_SelectAnswer_AnswerImage_MultipleQuestion = observer(
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
        characterStyle,
        isMultiQuestion,
      },
      ref,
    ) => {
      const globalStyle = useGlobalStyle();

      const {ttsSpeak} = useContext(TextToSpeechContext);
      const focus = useIsFocused();
      const answerRef = useRef<SelectionAnswersQuestionRef>(null);

      const [answerSelected, setAnswerSelected] = useState<string | string[]>(
        '',
      );
      const [multiQuestionAnswerSelected, setMultiQuestionAnswerSelected] =
        useStateCustom<TMultiQuestionAnswerSelected>({
          questionIndex: 0,
          answerSelected: [],
          answerHasSelected: [],
        });
      console.log('multiQuestionAnswerSelected: ', multiQuestionAnswerSelected);
      const correctAnswer = useMemo(() => {
        return [
          ['hammer', 'screwdriver'],
          ['wrench', 'pliers'],
          ['screw', 'nail'],
        ];
      }, []);

      const mockAnswerData = [
        {
          id: 1,
          name: 'hammer',
          image:
            'https://img.freepik.com/free-vector/claw-hammer-sticker-white-background_1308-80363.jpg?semt=ais_hybrid&w=740',
        },
        {
          id: 2,
          name: 'screwdriver',
          image:
            'https://res.cloudinary.com/rsc/image/upload/w_1024/Y1829689-01',
        },
        {
          id: 3,
          name: 'wrench',
          image:
            'https://images-na.ssl-images-amazon.com/images/I/71UQTCpwndL.jpg',
        },
        {
          id: 4,
          name: 'pliers',
          image: 'https://m.media-amazon.com/images/I/71FSIonNe3L.jpg',
        },
        {
          id: 5,
          name: 'screw',
          image:
            'https://www.hafele.com/INTERSHOP/static/WFS/Haefele-HAC-Site/-/Haefele-HAC/en_US/opentext/assets/hac/Chipboard_Screws_Teaser_880x880px.png',
        },
        {
          id: 6,
          name: 'nail',
          image:
            'https://5.imimg.com/data5/SELLER/Default/2023/1/AQ/YD/PU/140685744/5inch-high-density-iron-nail-500x500.webp',
        },
      ];

      const {trainingCount, getSetting} = useLessonStore();

      const {selectedChild} = useAuthenticationStore();

      const isCorrectAnswer = useMemo(() => {
        const correctAnswer =
          firstMiniTestTask?.question?.[moduleIndex]?.correctAnswer;
        const answerSelectedArray = (
          Array.isArray(answerSelected) ? answerSelected : [answerSelected]
        ).map(e => e?.toLocaleString().toLocaleLowerCase());
        const correctAnswerArray = (
          Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]
        ).map(e => e?.toLocaleString().toLocaleLowerCase());
        return isSubArray(answerSelectedArray, correctAnswerArray);
      }, [answerSelected, firstMiniTestTask?.question, moduleIndex]);

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
          setAnswerSelected('');
          nextModule((answerSelected as string[]).toString());
          answerRef.current?.resetAnswerSelected?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 60 * 5 * 50000,
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

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction
            ?.description ??
            settings.prompt?.toString() ??
            '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, settings.prompt, ttsSpeak]);

      const opacity = useSharedValue(0);
      const scaleS = useSharedValue(1);

      const onMultiQuestionSubmit = useCallback(() => {
        if (isMultiQuestion) {
          console.log('123');
        } else {
          submit();
        }
      }, [isMultiQuestion, submit]);

      const onSelectAnswer = item => {
        setMultiQuestionAnswerSelected({
          answerSelected: [
            ...(multiQuestionAnswerSelected.answerSelected ?? []),
            item.name,
          ],
        });
      };

      const onCheckResult = useCallback(() => {
        const tout = setTimeout(() => {
          clearTimeout(tout);
          if (
            JSON.stringify(
              correctAnswer?.[multiQuestionAnswerSelected.questionIndex ?? 0],
            ) === JSON.stringify(multiQuestionAnswerSelected.answerSelected)
          ) {
            setMultiQuestionAnswerSelected({
              answerSelected: [],
              questionIndex:
                (multiQuestionAnswerSelected.questionIndex ?? 0) + 1,
              answerHasSelected: [
                ...(multiQuestionAnswerSelected.answerHasSelected ?? []),
                ...(multiQuestionAnswerSelected.answerSelected ?? []),
              ],
            });
          } else {
            setMultiQuestionAnswerSelected({
              answerSelected: [],
            });
          }
        }, 3000);
      }, [
        correctAnswer,
        multiQuestionAnswerSelected.answerHasSelected,
        multiQuestionAnswerSelected.answerSelected,
        multiQuestionAnswerSelected.questionIndex,
        setMultiQuestionAnswerSelected,
      ]);

      useEffect(() => {
        if (multiQuestionAnswerSelected.answerSelected?.length === 2) {
          onCheckResult();
        }
      }, [multiQuestionAnswerSelected.answerSelected, onCheckResult]);

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

            const secondTimeout = setTimeout(() => {
              onSpeechText();
            }, 2500);

            return () => clearTimeout(secondTimeout);
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
              firstMiniTestTask?.question?.[moduleIndex]
                ?.correctAnswer as string,
            ),
          );
        },
      }));

      const rows = [mockAnswerData.slice(0, 3), mockAnswerData.slice(3, 6)];

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          characterStyle={characterStyle}
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
          txtCountDown={word && !isMMSS(word) ? undefined : word}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          onPressFlower={toggleShowHint}
          buildQuestion={
            <Animated.View
              style={[animatedStyle, styles.wrapQuestionContainer]}>
              <View
                style={[
                  styles.center,
                  {
                    gap: scale(16),
                  },
                ]}>
                <View style={[styles.flexRow, styles.center, {gap: scale(16)}]}>
                  <View style={styles.questionContainer}>
                    {Array.isArray(
                      multiQuestionAnswerSelected?.answerSelected,
                    ) &&
                      multiQuestionAnswerSelected.answerSelected.length > 0 && (
                        <Image
                          source={{
                            uri: mockAnswerData.find(
                              item =>
                                item.name ===
                                multiQuestionAnswerSelected.answerSelected?.[0],
                            )?.image,
                          }}
                          style={[
                            styles.wrapAnswerItemImage,
                            {borderRadius: 20},
                          ]}
                        />
                      )}
                  </View>
                  <Text style={styles.plusTitle}>+</Text>
                  <View style={styles.questionContainer}>
                    {Array.isArray(
                      multiQuestionAnswerSelected?.answerSelected,
                    ) &&
                      multiQuestionAnswerSelected.answerSelected.length > 1 && (
                        <Image
                          source={{
                            uri: mockAnswerData.find(
                              item =>
                                item.name ===
                                multiQuestionAnswerSelected.answerSelected?.[1],
                            )?.image,
                          }}
                          style={[
                            styles.wrapAnswerItemImage,
                            {borderRadius: 20},
                          ]}
                        />
                      )}
                  </View>
                </View>
                <View
                  style={[styles.questionContainer, {height: 118, width: 118}]}
                />
              </View>
            </Animated.View>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View style={[styles.fill]}>
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

              <View style={[styles.fill, styles.wrapAnswerContainer]}>
                <Text style={styles.headerAnswerTitle}>
                  Find Pairs that Interact with Each Other.
                </Text>
                <View style={[styles.fill, {gap: 8, marginTop: 16}]}>
                  {rows.map((row, rowIndex) => (
                    <View
                      key={rowIndex}
                      style={[styles.fill, styles.flexRow, {gap: 8}]}>
                      {row.map(item => {
                        const isSelected =
                          multiQuestionAnswerSelected.answerHasSelected?.includes(
                            item.name,
                          );
                        return isSelected ? (
                          <View
                            style={[
                              styles.wrapAnswerItemContainer,
                              {
                                backgroundColor: COLORS.GREEN_66C270,
                                borderColor: COLORS.GREEN_66C270,
                              },
                            ]}
                          />
                        ) : (
                          <TouchableOpacity
                            key={item.id}
                            style={[styles.wrapAnswerItemContainer]}
                            onPress={() => onSelectAnswer(item)}>
                            <Image
                              source={{uri: item.image}}
                              style={styles.wrapAnswerItemImage}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                style={[
                  styles.buttonContainer,
                  {backgroundColor: settings.backgroundButtonColor},
                ]}
                onPress={onMultiQuestionSubmit}
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

export default Science_SelectAnswer_AnswerImage_MultipleQuestion;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_SVN_Neuzeit_Bold: {
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  textQuestion: {
    fontSize: verticalScale(15),
    textAlign: 'left',
    color: COLORS.BLUE_258F78,
  },
  boxSelected: {
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(220),
    flex: 1,
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  iconImageContainer: {
    height: verticalScale(39),
    width: verticalScale(34),
  },
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
  wrapQuestionContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  questionContainer: {
    height: 96,
    width: 96,
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: COLORS.GREEN_66C270,
  },
  plusTitle: {
    fontSize: 40,
    color: COLORS.GREEN_66C270,
    fontFamily: FontFamily.SVNCherishMoment,
  },
  wrapAnswerContainer: {
    borderRadius: 30,
    backgroundColor: COLORS.WHITE_FBF8CC,
    padding: 16,
  },
  headerAnswerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FontFamily.SVNNeuzeitRegular,
    color: COLORS.BLUE_258F78,
  },
  wrapAnswerBodyContainer: {
    flex: 1,
  },
  wrapAnswerItemContainer: {
    borderRadius: 10,
    borderWidth: 4,
    borderColor: COLORS.YELLOW_F2B559,
    width: '32%',
    height: '100%',
  },
  wrapAnswerItemImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
