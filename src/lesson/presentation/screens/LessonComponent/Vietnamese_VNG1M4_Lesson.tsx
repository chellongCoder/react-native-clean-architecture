/* eslint-disable react-native/no-inline-styles */
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
import {COLORS} from 'src/core/presentation/constants/colors';
import {darkenColor, getCorrectAnswer} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import {useLessonStore} from '../../stores/LessonStore/useGetPostsStore';
import {useSettingLesson} from '../../hooks/useSettingLesson';
import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {LessonRef} from '../../types';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';
import VoiceButton from '../../components/VoiceButton';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import {Task} from 'src/home/application/types/GetListQuestionResponse';
import Tts from 'react-native-tts';
import {listLanguage} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
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

const VietnameseLetterQuyLesson = observer(
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
      const {ttsSpeak, updateDefaultVoice} = useContext(TextToSpeechContext);
      const focus = useIsFocused();
      const i18n = useI18n();

      const [selectedParts, setSelectedParts] = useState<string[]>([]);

      const [isCombined, setIsCombined] = useState(false);

      const {trainingCount, getSetting} = useLessonStore();
      const {lessonSetting} = useHomeStore();

      const settings = useMemo(
        () => getSetting(lessonSetting),
        [getSetting, lessonSetting],
      );

      const {isAnswerCorrect, isShowCorrectContainer, resetLearning, submit} =
        useSettingLesson({
          countDownTime: 0,
          isCorrectAnswer: isCombined,
          onSubmit: () => {
            nextModule(
              (firstMiniTestTask?.question?.[moduleIndex]
                .correctAnswer as string) ?? '',
            );
            setSelectedParts([]);
            setIsCombined(false);
          },
          fullAnswer: firstMiniTestTask?.question?.[moduleIndex].content ?? '',
          totalTime: 5 * 60,
        });

      const characterImage = useMemo(() => {
        return isAnswerCorrect === true || isAnswerCorrect === undefined
          ? characterImageSuccess
          : characterImageFail;
      }, [characterImageFail, characterImageSuccess, isAnswerCorrect]);

      const onSpeechText = useCallback(() => {
        ttsSpeak?.(
          firstMiniTestTask?.question?.[moduleIndex].description ?? '',
        );
      }, [firstMiniTestTask?.question, moduleIndex, ttsSpeak]);

      const handlePartSelection = (part: string) => {
        if (selectedParts.includes(part)) {
          setSelectedParts(selectedParts.filter(p => p !== part));
        } else {
          setSelectedParts([...selectedParts, part]);
        }
      };

      // Add this function before the handleCombine function:
      const areArraysEqual = (arr1: string[], arr2: string[]) => {
        if (arr1.length !== arr2.length) {
          return false;
        }
        return arr1.every((value, index) => value === arr2[index]);
      };

      const handleCombine = () => {
        const answers =
          firstMiniTestTask?.question?.[moduleIndex].answers ?? [];
        if (
          selectedParts.length === answers.length &&
          areArraysEqual(selectedParts, answers as string[])
        ) {
          setIsCombined(true);
        }
      };

      useEffect(() => {
        if (isCombined) {
          submit();
        }
      }, [isCombined, submit]);

      useEffect(() => {
        resetLearning();
      }, [trainingCount, resetLearning]);

      useEffect(() => {
        Tts.voices().then(voices => {
          if (lessonName.toLocaleLowerCase().includes('tiếng việt')) {
            const vietnameseVoices = voices.filter(
              voice =>
                voice.language.startsWith('vi-') ||
                voice.name.toLowerCase().includes('vietnamese'),
            );

            updateDefaultVoice?.(vietnameseVoices[0]?.id, 'Vie (Vietnamese)');
          }
        });
      }, [lessonName, updateDefaultVoice]);

      useEffect(() => {
        if (focus) {
          const firstTimeout = setTimeout(() => {
            onSpeechText();

            const secondTimeout = setTimeout(() => {
              onSpeechText();
            }, 2500);

            return () => clearTimeout(secondTimeout);
          }, 1500);

          return () => clearTimeout(firstTimeout);
        }
      }, [onSpeechText, focus]);

      useImperativeHandle(ref, () => ({
        isAnswerCorrect,
        onChoiceCorrectedAnswer: () => {
          handleCombine();
        },
      }));

      return (
        <LessonComponent
          backgroundImage={backgroundImage}
          characterImage={characterImage}
          lessonName={lessonName}
          module={moduleName}
          part={firstMiniTestTask?.name}
          backgroundColor={settings.backgroundColor}
          backgroundAnswerColor={settings.backgroundAnswerColor}
          prompt={
            firstMiniTestTask?.question?.[moduleIndex]?.instruction ?? {
              description: settings.prompt?.toString() ?? '',
            }
          }
          price="Free"
          txtCountDown={undefined}
          isAnswerCorrect={isAnswerCorrect}
          isShowCorrectContainer={isShowCorrectContainer}
          buildQuestion={
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text style={[styles.font_borel, styles.textTitle]}>
                {firstMiniTestTask?.question?.[moduleIndex].content}
              </Text>
            </View>
          }
          buildAnswer={
            <View style={styles.fill}>
              <View style={styles.wrapHeaderContainer}>
                <View style={{justifyContent: 'center', flex: 1}}>
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
                    {isCombined
                      ? i18n.t('lesson.screens.Modules.combineWordSuccess')
                      : i18n.t('lesson.screens.Modules.combineWord')}
                  </Text>
                </View>

                <VoiceButton onPress={onSpeechText} />
              </View>

              {isCombined ? (
                <View style={styles.combinedContainer}>
                  <Text style={styles.combinedText}>
                    {firstMiniTestTask?.question?.[moduleIndex].content}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.letterPartsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.letterPart,
                        {flex: 5 / 10},
                        selectedParts.includes(
                          firstMiniTestTask?.question?.[moduleIndex]
                            .answers?.[0] ?? '',
                        ) && styles.selectedPart,
                      ]}
                      onPress={() =>
                        handlePartSelection(
                          firstMiniTestTask?.question?.[moduleIndex]
                            .answers?.[0] ?? '',
                        )
                      }>
                      <Text
                        adjustsFontSizeToFit
                        allowFontScaling
                        style={styles.letterPartText}>
                        {
                          firstMiniTestTask?.question?.[moduleIndex]
                            .answers?.[0]
                        }
                      </Text>
                    </TouchableOpacity>

                    <View style={{flex: 5 / 10}}>
                      <TouchableOpacity
                        style={[
                          styles.letterPart,
                          {flex: 5 / 10},
                          selectedParts.includes(
                            firstMiniTestTask?.question?.[moduleIndex]
                              .answers?.[1] ?? '',
                          ) && styles.selectedPart,
                        ]}
                        onPress={() =>
                          handlePartSelection(
                            firstMiniTestTask?.question?.[moduleIndex]
                              .answers?.[1] ?? '',
                          )
                        }>
                        <Text
                          style={[
                            styles.letterPartText,
                            {fontSize: verticalScale(40)},
                          ]}>
                          {
                            firstMiniTestTask?.question?.[moduleIndex]
                              .answers?.[1]
                          }
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.letterPart,
                          {flex: 5 / 10},
                          selectedParts.includes(
                            firstMiniTestTask?.question?.[moduleIndex]
                              .answers?.[2] ?? '',
                          ) && styles.selectedPart,
                        ]}
                        onPress={() =>
                          handlePartSelection(
                            firstMiniTestTask?.question?.[moduleIndex]
                              .answers?.[2] ?? '',
                          )
                        }>
                        <Text
                          style={[
                            styles.letterPartText,
                            {fontSize: verticalScale(40)},
                          ]}>
                          {
                            firstMiniTestTask?.question?.[moduleIndex]
                              .answers?.[2]
                          }
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              <PrimaryButton
                text={i18n.t('lesson.screens.Modules.submit')}
                disable={selectedParts.length !== 3}
                style={[
                  styles.buttonContainer,
                  {
                    backgroundColor: settings.backgroundButtonColor,
                  },
                ]}
                onPress={handleCombine}
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

export default VietnameseLetterQuyLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  font_borel: {
    fontFamily: FontFamily.BorelRegular,
  },
  textTitle: {
    fontSize: verticalScale(90),
    textAlign: 'center',
    color: COLORS.BLUE_258F78,
  },

  textColor: {
    color: COLORS.RED_AF3A1B,
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    borderRadius: scale(52),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(24),
    marginTop: scale(16),
    backgroundColor: '#4CAF50',
  },
  letterPartsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: verticalScale(20),
    // flex: 1,
    backgroundColor: COLORS.WHITE_FBF8CC,
    height: verticalScale(180),
    padding: scale(20),
    borderRadius: scale(30),
  },
  letterPart: {
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(5),
    flex: 1,
    borderColor: COLORS.YELLOW_F2B559,
    borderWidth: 3,
  },
  selectedPart: {
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: COLORS.YELLOW_F2B559,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterPartText: {
    fontFamily: FontFamily.BorelRegular,
    fontSize: verticalScale(70),
    color: COLORS.BLUE_258F78,
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%', // Add width to ensure text takes full width
    height: '100%', // Add height to ensure text takes full height
  },
  combineButton: {
    width: '90%',
    height: verticalScale(50),
    backgroundColor: '#FEDF68',
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  combineButtonText: {
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: verticalScale(22),
    color: COLORS.BACKGROUND,
  },
  combinedContainer: {
    width: '90%',
    height: verticalScale(150),
    backgroundColor: '#86C68C',
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: verticalScale(20),
  },
  combinedText: {
    fontFamily: FontFamily.BorelRegular,
    fontSize: verticalScale(60),
    color: '#FFF',
  },
});
