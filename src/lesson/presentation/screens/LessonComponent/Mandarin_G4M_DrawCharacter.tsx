import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StyleProp,
  ViewStyle,
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
import {CanvasWriteRef} from '../../components/CanvasWrite';
import HanziWrite from '../../components/HanziWrite';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  getCorrectAnswer,
  splitChineseWithFilter,
} from 'src/core/presentation/utils';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {COLORS} from 'src/core/presentation/constants/colors';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useIsFocused} from '@react-navigation/native';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import VoiceButton from '../../components/VoiceButton';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LearningImage from '../../components/LearningImage';
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
  characterStyle?: StyleProp<ViewStyle>;
};

type Mandarin_G4M_DrawCharacterRef = {
  onChoiceCorrectedAnswer: () => void;
};

const Mandarin_G4M_DrawCharacter = forwardRef<
  Mandarin_G4M_DrawCharacterRef,
  Props
>(
  (
    {
      moduleIndex,
      nextModule,
      totalModule,
      lessonName,
      moduleName,
      firstMiniTestTask,
      backgroundImage,
      characterImageFail,
      characterImageSuccess,
      characterStyle,
    }: Props,
    ref,
  ) => {
    const globalStyle = useGlobalStyle();
    const canvasWriteRef = useRef<CanvasWriteRef>(null);
    const {selectedChild} = useAuthenticationStore();
    const [answerSelected, setAnswerSelected] = useState('');
    const {trainingCount, getSetting} = useLessonStore();
    const [isCorrect, setIscorrect] = useState(false);
    const [statusCharacter, setStatusCharacter] = useState<boolean[]>([]);

    const i18n = useI18n();

    const {ttsSpeak} = useContext(TextToSpeechContext);
    const focus = useIsFocused();
    const {lessonSetting} = useHomeStore();

    const opacity = useSharedValue(0);
    const scaleS = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{scale: scaleS.value}],
      };
    });
    const settings = useMemo(
      () => getSetting(lessonSetting),
      [getSetting, lessonSetting],
    );

    const {isAnswerCorrect, isShowCorrectContainer, submit, env} =
      useSettingLesson({
        countDownTime: trainingCount <= 2 ? 0 : 5,
        isCorrectAnswer: !!isCorrect,
        onSubmit: () => {
          setAnswerSelected('');
          nextModule(answerSelected);
          setIscorrect(false);
        },
        fullAnswer: firstMiniTestTask?.question?.[moduleIndex].fullAnswer,
        totalTime: 5 * 60, // * tổng time làm 1câu
      });

    const characterImage = useMemo(() => {
      return isAnswerCorrect === true || isAnswerCorrect === undefined
        ? characterImageSuccess
        : characterImageFail;
    }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

    const onSpeechText = useCallback(() => {
      if (
        typeof firstMiniTestTask?.question?.[moduleIndex]?.instruction ===
        'string'
      ) {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? '',
        );
      } else {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex]?.instruction
            ?.description ?? '',
        );
      }
    }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

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
      if (
        statusCharacter.length ===
        firstMiniTestTask?.question?.[moduleIndex]?.answers.length
      ) {
        setIscorrect(true);
      }
    }, [firstMiniTestTask?.question, moduleIndex, statusCharacter]);

    useImperativeHandle(ref, () => ({
      //
      onChoiceCorrectedAnswer: () => {
        setIscorrect(true);
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
        backgroundAnswerColor={settings.backgroundAnswerColor}
        prompt={
          firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
            description: settings.prompt?.toString() ?? '',
          }
        }
        score={selectedChild?.adsPoints}
        isAnswerCorrect={isAnswerCorrect}
        isShowCorrectContainer={isShowCorrectContainer}
        buildQuestion={
          <>
            {typeof firstMiniTestTask?.question?.[moduleIndex].image ===
            'string' ? (
              <View>
                <Animated.Image
                  resizeMode={'contain'}
                  width={scale(200)}
                  height={scale(150)}
                  style={[{}, animatedStyle]}
                  source={{
                    uri:
                      env.IMAGE_QUESTION_BASE_API_URL +
                      firstMiniTestTask?.question?.[moduleIndex].image,
                  }}
                />
              </View>
            ) : (
              <LearningImage
                images={
                  firstMiniTestTask?.question?.[moduleIndex].image as string[]
                }
                styleContainer={{
                  width: scale(150),
                  aspectRatio: 1.5,
                  borderWidth: 0,
                }}
              />
            )}
            <Text style={styles.textQuestion}>
              {firstMiniTestTask?.question?.[moduleIndex].description}
            </Text>
          </>
        }
        characterStyle={
          characterStyle ?? {
            height: verticalScale(250),
            marginBottom: -verticalScale(80),
            marginLeft: -scale(30),
          }
        }
        buildAnswer={
          <View style={styles.fill}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  {color: settings.backgroundButtonColor},
                ]}>
                {i18n.t('lesson.screens.Modules.writeTheCharacter')}
              </Text>
              <VoiceButton onPress={onSpeechText} />
            </View>

            <View style={{height: verticalScale(10)}} />
            <View style={styles.ctnCharacter}>
              <ScrollIndicator
                indicatorColor={settings.backgroundButtonColor}
                indicatorContainerColor={settings.backgroundButtonColor}
                indicatorStyle={{marginRight: scale(6)}}>
                <FlatList
                  scrollEnabled={false}
                  data={splitChineseWithFilter(
                    firstMiniTestTask?.question?.[
                      moduleIndex
                    ]?.answers?.toString() ?? '',
                  )}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{
                    flexGrow: 1,
                    padding: scale(10),
                  }}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                    paddingHorizontal: scale(10),
                    marginBottom: verticalScale(10),
                  }}
                  renderItem={({item, index}) => (
                    <HanziWrite
                      key={index}
                      ref={canvasWriteRef}
                      text={{
                        content: item,
                        color: COLORS.PRIMARY,
                      }}
                      onComplete={_ => {
                        setStatusCharacter(prev => [...prev, true]);
                      }}
                    />
                  )}
                />
              </ScrollIndicator>
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
);

export default Mandarin_G4M_DrawCharacter;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  fonts_NeuzeitBold: {
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  fonts_Neuzeit: {
    fontFamily: FontFamily.SVNNeuzeitRegular,
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: scale(36),
    textAlign: 'center',
    color: COLORS.RED_811010,
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  textQuestion2: {
    fontSize: scale(20),
    textAlign: 'center',
    color: COLORS.RED_811010,
  },

  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#0877B6',
  },
  ctnCharacter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE_FBF8CC,
    borderRadius: scale(30),
  },
});
