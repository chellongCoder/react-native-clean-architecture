import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {
  forwardRef,
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
import {SelectionAnswersQuestionRef} from '../../../components/SelectionAnswersQuestion';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../../components/VoiceButton';
import FastImage from 'react-native-fast-image';
import TextHighlight from '../../../components/TextHighlight';
import {useHistoryModule} from './hook';
import {H6M1P1AnswerI} from 'src/home/application/types/GetListQuestionResponse';

const CIRCULAR_LAYOUT_SCALE = 0.82;
const CIRCULAR_CONTAINER_SIZE = scale(213 * CIRCULAR_LAYOUT_SCALE);
const CIRCULAR_ITEM_SIZE = scale(92 * CIRCULAR_LAYOUT_SCALE);
const CIRCULAR_CONTAINER_PADDING = scale(64 * CIRCULAR_LAYOUT_SCALE);
const CIRCULAR_BORDER_WIDTH = 3 * CIRCULAR_LAYOUT_SCALE;
const CIRCULAR_TITLE_FONT_SIZE = scale(20 * CIRCULAR_LAYOUT_SCALE);
const CIRCULAR_ITEM_FONT_SIZE = scale(13 * CIRCULAR_LAYOUT_SCALE);

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

const HistoryHS6M1P1 = observer(
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

      const answerRef = useRef<SelectionAnswersQuestionRef>();

      const [answerSelected, setAnswerSelected] = useState('');
      const [selectedItem, setSelectedItem] = useState<H6M1P1AnswerI | null>(
        null,
      );

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
        submit,
        toggleShowHint,
        resetLearning,
      } = useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: isCorrectAnswer,
        onSubmit: () => {
          setAnswerSelected('');
          setSelectedItem(null);
          setIsCorrectAnswer(undefined);
          nextModule(answerSelected);
          answerRef.current?.resetAnswerSelected?.();
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 5 * 60,
      });

      const {lessonSetting} = useHomeStore();

      const i18n = useI18n();

      // Handle item selection
      const handleItemSelection = (item: H6M1P1AnswerI) => {
        setIsCorrectAnswer(true);
        setSelectedItem(item);
      };

      // Calculate circular positions for items
      const calculateCircularPositions = (itemCount: number) => {
        const maxItems = Math.min(itemCount, 5);
        const containerSize = CIRCULAR_CONTAINER_SIZE;
        const itemSize = CIRCULAR_ITEM_SIZE;
        const containerCenter = containerSize / 2;
        const itemRadius = itemSize / 2;
        // Position items on the circumference - adjust radius to balance distance from center
        // Original items were positioned further out than 0.7 but not as far as 1.15
        const positioningRadius = containerCenter; // Balanced radius for items closer to middle

        const positions = [];
        for (let i = 0; i < maxItems; i++) {
          // Calculate angle: evenly distribute around circle, starting from top (-π/2)
          const angle = (2 * Math.PI * i) / maxItems - Math.PI / 2;
          // Calculate x and y positions relative to container center, then convert to absolute
          const centerX = containerCenter + positioningRadius * Math.cos(angle);
          const centerY = containerCenter + positioningRadius * Math.sin(angle);

          // Position the item's top-left corner (accounting for item radius)
          const x = centerX - itemRadius;
          const y = centerY - itemRadius;

          positions.push({
            style: {
              top: y,
              left: x,
            },
          });
        }
        return positions;
      };

      // Render mapped items
      const renderMappedItems = () => {
        const items = firstMiniTestTask?.question?.[moduleIndex].answers;
        const itemCount = (items as H6M1P1AnswerI[])?.length || 0;
        const positions = calculateCircularPositions(itemCount);

        return (items as H6M1P1AnswerI[])?.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.circularItem,
              positions[index]?.style,
              selectedItem?.content === item.content && {
                backgroundColor: COLORS.PRIMARY,
              },
            ]}
            onPress={() => handleItemSelection(item)}>
            <Text style={[styles.circularItemText, styles.fonts_SVN_Cherish]}>
              {item.content}
            </Text>
          </TouchableOpacity>
        ));
      };

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
          prompt={{
            description:
              firstMiniTestTask?.question?.[moduleIndex]?.prompt ??
              settings.prompt?.toString() ??
              '',
          }}
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
            <View>
              <View style={styles.circularContainer}>
                <Text style={[styles.fonts_SVN_Cherish, styles.centerTitle]}>
                  {firstMiniTestTask?.question?.[moduleIndex].content}
                </Text>
                {renderMappedItems()}
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
                  borderRadius: scale(10),
                  padding: scale(10),
                  flex: 1,
                }}>
                {selectedItem ? (
                  <>
                    <TextHighlight
                      content={'Ấn vào các vòng tròn bên trên'}
                      description={'Ấn vào các vòng tròn bên trên'}
                    />
                    <View style={styles.contentRow}>
                      <FastImage
                        source={{
                          uri:
                            env.IMAGE_QUESTION_BASE_API_URL +
                            selectedItem.image,
                        }}
                        style={styles.imageContainer}
                      />
                      <View style={styles.descriptionContainer}>
                        <Text
                          style={[
                            styles.descriptionText,
                            styles.fonts_SVN_Cherish,
                          ]}>
                          {selectedItem.description}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text
                      style={[
                        styles.placeholderText,
                        styles.fonts_SVN_Cherish,
                      ]}>
                      Ấn vào các vòng tròn bên trên để hiển thị bài học
                    </Text>
                  </View>
                )}
              </View>

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

export default HistoryHS6M1P1;

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
    height: CIRCULAR_CONTAINER_SIZE,
    width: CIRCULAR_CONTAINER_SIZE,
    borderRadius: 999,
    borderWidth: CIRCULAR_BORDER_WIDTH,
    borderColor: COLORS.YELLOW_F2B559,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: CIRCULAR_CONTAINER_PADDING,
  },
  centerTitle: {
    fontSize: CIRCULAR_TITLE_FONT_SIZE,
    color: COLORS.RED_D36323,
    textAlign: 'center',
  },
  circularItem: {
    width: CIRCULAR_ITEM_SIZE,
    height: CIRCULAR_ITEM_SIZE,
    backgroundColor: COLORS.YELLOW_F2B559,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: scale(8),
  },
  circularItemText: {
    fontSize: CIRCULAR_ITEM_FONT_SIZE,
    color: COLORS.WHITE_FBF8CC,
    textAlign: 'center',
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
