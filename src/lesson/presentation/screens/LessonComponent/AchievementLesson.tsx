import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LessonComponent from './LessonComponent';
import PrimaryButton from '../../components/PrimaryButton';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import IconStar from 'assets/svg/iconStar';
import IconCup from 'assets/svg/IconCup';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

type Props = {
  moduleIndex: number;
  totalModule: number;
  nextModule: () => void;
};

const AchievementLesson = ({moduleIndex, nextModule, totalModule}: Props) => {
  const globalStyle = useGlobalStyle();
  return (
    <LessonComponent
      module="Module 1"
      backgroundColor="#66c270"
      backgroundAnswerColor="#FFD75A"
      buildQuestion={
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>Á</Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            CON CÁ
          </Text>
        </View>
      }
      buildAnswer={
        <View style={styles.fill}>
          <View style={[styles.viewContent]}>
            <View style={[styles.boxIconStar]}>
              <IconStar width={120} height={120} />
              <View style={[styles.boxIconCup]}>
                <IconCup />
              </View>
            </View>
            <Text style={globalStyle.txtLabel}>Achievement</Text>
            <Text style={[globalStyle.txtNote, styles.pb32]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              Lorem Ipsum has been....
            </Text>
            <View style={[styles.rowAlignCenter, styles.alignSelfCenter]}>
              <View style={[styles.boxIconRoundTiny]} />
              <Text style={globalStyle.txtLabel}> x 5</Text>
            </View>
          </View>
          <View style={[styles.rowAround]}>
            <PrimaryButton
              text="Recieve award"
              style={[styles.mt32]}
              onPress={() => {
                nextModule();
              }}
            />
            <PrimaryButton
              text="Submit"
              style={[styles.mt32]}
              onPress={() => {
                nextModule();
              }}
            />
          </View>
        </View>
      }
      moduleIndex={moduleIndex}
      totalModule={totalModule}
    />
  );
};

export default AchievementLesson;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textLarge: {
    fontSize: 140,
    textAlign: 'center',
    color: 'white',
  },
  textQuestion: {
    fontSize: 40,
    textAlign: 'center',
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
  pb32: {
    paddingBottom: 32,
  },
  mt32: {
    marginTop: 32,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  viewContent: {
    backgroundColor: '#FBF8CC',
    borderRadius: 30,
    padding: 32,
    marginTop: 70,
  },
  boxIconStar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#66C270',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: -70 - 32,
    justifyContent: 'center',
  },
  boxIconCup: {position: 'absolute', top: 55},
  boxIconRoundTiny: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#66C270',
  },
});
