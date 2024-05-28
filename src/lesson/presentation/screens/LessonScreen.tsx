import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import CanvasWrite, {CanvasWriteRef} from '../components/CanvasWrite';
import PrimaryButton from '../components/PrimaryButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import IconDiamond from 'assets/svg/IconDiamond';
import IconStar from 'assets/svg/iconStar';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconCup from 'assets/svg/IconCup';
import IconListen from 'assets/svg/IconListen';
import IconMic from 'assets/svg/IconMic';
import IconFrequency from 'assets/svg/IconFrequency';

const matchPointsA = [
  [8.456913341175436, 130.62562561035156],
  [10.493090542879969, 111.93546225807884],
  [14.81996154785156, 93.64533441716975],
  [18.38327165083453, 73.50071438876066],
  [21.03756852583453, 57.46502546830611],
  [27.618767478249282, 42.70197504216975],
  [37.83600824529475, 38.30216147682883],
  [46.48975025523794, 48.592644431374296],
  [48.45321793989703, 65.17378789728338],
  [49.798543756658376, 80.2277207808061],
  [55.28893349387428, 92.48176019841975],
  [53.90725291859019, 104.33580849387428],
  [53.72545693137428, 123.46227333762428],
  [54.016339388760656, 130.22563448819247],
  [53.034605546431095, 112.62633583762428],
  [41.872007890181095, 106.80842035466975],
  [34.19997752796519, 109.75373285466975],
  [24.964470603249282, 107.97199457341975],
  [41.14480174671519, 18.01212241432883],
  [46.96242869984019, 5.9399011785333755],
  [42.19924510609019, 12.19416254216975],
].map(v => ({x: v[0], y: v[1]}));

type LayoutType = {
  module: string;
  backgroundColor: string;
  backgroundAnswerColor: string;
  buildQuestion: React.ReactNode;
  buildAnswer: React.ReactNode;
};

const LessonScreen = () => {
  const canvasWriteRef = useRef<CanvasWriteRef>(null);
  const insets = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();

  const listLayouts: LayoutType[] = [
    {
      module: 'Module 1',
      backgroundColor: '#66c270',
      backgroundAnswerColor: '#FFD75A',
      buildQuestion: (
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>Á</Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            CON CÁ
          </Text>
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <View
            style={[
              {
                backgroundColor: '#FBF8CC',
                borderRadius: 30,
                padding: 32,
                marginTop: 70,
              },
            ]}>
            <View
              style={[
                {
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: '#66C270',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginTop: -70 - 32,
                  justifyContent: 'center',
                },
              ]}>
              <IconStar width={120} height={120} />
              <View style={{position: 'absolute', top: 55}}>
                <IconCup />
              </View>
            </View>
            <Text style={globalStyle.txtLabel}>Achievement</Text>
            <Text style={[globalStyle.txtNote, styles.pb32]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              Lorem Ipsum has been....
            </Text>
            <View style={[styles.rowAlignCenter, {alignSelf: 'center'}]}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#66C270',
                }}
              />
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
      ),
    },
    {
      module: 'Module 2',
      backgroundColor: '#66c270',
      backgroundAnswerColor: '#DDF598',
      buildQuestion: (
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>Á</Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            CON CÁ
          </Text>
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <Text style={[globalStyle.txtLabel, styles.pb32]}>Write the "Á"</Text>
          <CanvasWrite
            ref={canvasWriteRef}
            text={{content: 'Á', color: '#66C270'}}
            matchPoints={matchPointsA}
          />
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              const result = canvasWriteRef.current?.getResult();
              const isCorrect =
                result &&
                result?.matchPointNumber > matchPointsA.length - 4 &&
                result?.strokesNumber <= 3 &&
                result.maxDistance <= 15;
              Alert.alert(
                'Kết quả',
                `${isCorrect ? 'chính xác' : 'không chính xác'}`,
              );
              canvasWriteRef.current?.reset();
              nextModule();
            }}
          />
        </View>
      ),
    },
    {
      module: 'Module 3',
      backgroundColor: '#e2cbf7',
      backgroundAnswerColor: '#98A1F5',
      buildQuestion: (
        <View>
          <Text style={[styles.fonts_SVN_Cherish, styles.textLarge]}>Á</Text>
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            CON CÁ
          </Text>
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <Text style={[globalStyle.txtLabel, styles.pb32, {color: 'white'}]}>
            Listen and Repeat
          </Text>
          <View style={[styles.rowBetween, styles.ph24, styles.pb16]}>
            <View
              style={[
                {
                  height: 96,
                  width: 96,
                  borderRadius: 15,
                  backgroundColor: '#F2B559',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <IconListen />
            </View>
            <View
              style={[
                {
                  height: 96,
                  width: 96,
                  borderRadius: 15,
                  backgroundColor: '#258F78',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <IconMic />
            </View>
          </View>
          <View
            style={[
              {
                backgroundColor: '#FBF8CC',
                height: 150,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <IconFrequency />
          </View>
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              nextModule();
            }}
          />
        </View>
      ),
    },
    {
      module: 'Module 4',
      backgroundColor: '#f28759',
      backgroundAnswerColor: '#FFE699',
      buildQuestion: (
        <View>
          <View style={styles.pb32} />
          <Text style={[styles.fonts_SVN_Cherish, styles.textQuestion]}>
            UỐNG ... NHỚ ...
          </Text>
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <Text style={[globalStyle.txtLabel, styles.pb32]}>
            Fill the blank
          </Text>
          <View style={[styles.rowBetween, styles.pb16]}>
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 30},
                styles.center,
                styles.container,
              ]}>
              <Text style={[globalStyle.txtLabel]}>nuoc - nguon</Text>
            </View>
            <View style={{paddingRight: 16}} />
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 30},
                styles.center,
                styles.container,
              ]}>
              <Text style={[globalStyle.txtLabel]}>truoc - nguon</Text>
            </View>
          </View>
          <View style={[styles.rowBetween, styles.pb32]}>
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 30},
                styles.center,
                styles.container,
              ]}>
              <Text style={[globalStyle.txtLabel]}>nuoc - nguon</Text>
            </View>
            <View style={{paddingRight: 16}} />
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 30},
                styles.center,
                styles.container,
              ]}>
              <Text style={[globalStyle.txtLabel]}>nuoc - nguon</Text>
            </View>
          </View>
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              nextModule();
            }}
          />
        </View>
      ),
    },
    {
      module: 'Module 5',
      backgroundColor: '#a3f0df',
      backgroundAnswerColor: '#358DBE',
      buildQuestion: (
        <View>
          <View style={styles.pb32} />
          <Text
            style={[
              styles.fonts_SVN_Cherish,
              styles.textQuestion,
              {color: '#1C6349'},
            ]}>
            hôm nay{'\n'}tôi cảm thấy vui vẻ
          </Text>
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <Text style={[globalStyle.txtLabel, styles.pb32, {color: 'white'}]}>
            Translate to English
          </Text>
          <View style={[{flexDirection: 'row'}, styles.pb32]}>
            <View
              style={[
                {
                  backgroundColor: '#FBF8CC',
                  borderRadius: 15,
                  padding: 12,
                  marginRight: 8,
                },
              ]}>
              <Text style={globalStyle.txtLabel}>I</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: '#FBF8CC',
                  borderRadius: 15,
                  padding: 12,
                  marginRight: 8,
                },
              ]}>
              <Text style={globalStyle.txtLabel}>Today</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: '#FBF8CC',
                  borderRadius: 15,
                  padding: 12,
                  marginRight: 8,
                },
              ]}>
              <Text style={globalStyle.txtLabel}>Happy</Text>
            </View>

            <View
              style={[
                {
                  backgroundColor: '#FBF8CC',
                  borderRadius: 15,
                  padding: 12,
                  marginRight: 8,
                },
              ]}>
              <Text style={globalStyle.txtLabel}>feel</Text>
            </View>
          </View>
          <View
            style={[
              {
                backgroundColor: '#FBF8CC',
                height: 150,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          />
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              nextModule();
            }}
          />
        </View>
      ),
    },
    {
      module: 'Module 6',
      backgroundColor: '#a3f0df',
      backgroundAnswerColor: '#358DBE',
      buildQuestion: (
        <View style={{width: '100%'}}>
          <TouchableOpacity
            style={[
              {
                width: 106,
                height: 106,
                backgroundColor: '#F28759',
                position: 'absolute',
                top: 20,
                left: 20,
                transform: [{rotate: '45deg'}],
              },
            ]}
          />
          <TouchableOpacity
            style={[
              {
                width: 0,
                height: 0,
                borderLeftWidth: 50,
                borderRightWidth: 50,
                borderBottomWidth: 100,
                borderStyle: 'solid',
                backgroundColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: '#F2B559',
                position: 'absolute',
                top: -10,
                left: 160,
                transform: [{rotate: '-30deg'}],
              },
            ]}
          />
          <TouchableOpacity
            style={[
              {
                width: 106,
                height: 106,
                borderRadius: 90,
                backgroundColor: '#3AB89C',
                position: 'absolute',
                top: 110,
                left: 100,
                transform: [{rotate: '45deg'}],
              },
            ]}
          />
          <TouchableOpacity
            style={[
              {
                width: 50,
                height: 50,
                backgroundColor: '#358DBE',
                position: 'absolute',
                top: 130,
                left: 240,
                transform: [{rotate: '45deg'}],
              },
            ]}
          />
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <Text style={[globalStyle.txtLabel, styles.pb32, {color: 'white'}]}>
            Which is circle?
          </Text>
          <View
            style={[
              {
                backgroundColor: '#FBF8CC',
                height: 230,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          />
          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              nextModule();
            }}
          />
        </View>
      ),
    },
    {
      module: 'Module 7',
      backgroundColor: '#a3f0df',
      backgroundAnswerColor: '#358DBE',
      buildQuestion: (
        <View>
          <View style={styles.pb32} />
          <Text
            style={[
              styles.fonts_SVN_Cherish,
              styles.textQuestion,
              {color: '#1C6349'},
            ]}>
            56 + ? = 100
          </Text>
        </View>
      ),
      buildAnswer: (
        <View style={styles.container}>
          <Text style={[globalStyle.txtLabel, styles.pb32, {color: 'white'}]}>
            Which is answer ?
          </Text>

          <View style={[styles.rowBetween, styles.pb16]}>
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 15},
                styles.center,
                styles.container,
              ]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                40
              </Text>
            </View>
            <View style={{paddingRight: 16}} />
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 15},
                styles.center,
                styles.container,
              ]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                54
              </Text>
            </View>
            <View style={{paddingRight: 16}} />
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 15},
                styles.center,
                styles.container,
              ]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                46
              </Text>
            </View>
          </View>

          <View style={[styles.rowBetween, styles.pb16]}>
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 15},
                styles.center,
                styles.container,
              ]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                45
              </Text>
            </View>
            <View style={{paddingRight: 16}} />
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 15},
                styles.center,
                styles.container,
              ]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                43
              </Text>
            </View>
            <View style={{paddingRight: 16}} />
            <View
              style={[
                {height: 94, backgroundColor: '#F2B559', borderRadius: 15},
                styles.center,
                styles.container,
              ]}>
              <Text
                style={[
                  globalStyle.txtLabel,
                  styles.textQuestion,
                  styles.fonts_SVN_Cherish,
                ]}>
                44
              </Text>
            </View>
          </View>

          <PrimaryButton
            text="Submit"
            style={[styles.mt32]}
            onPress={() => {
              nextModule();
            }}
          />
        </View>
      ),
    },
  ];

  const [layoutIndex, setLayoutIndex] = useState(0);

  const layout = listLayouts[layoutIndex];

  const nextModule = () => {
    setLayoutIndex((layoutIndex + 1) % listLayouts.length);
  };

  return (
    <View
      style={[
        styles.screen,
        {paddingTop: insets.top, backgroundColor: layout.backgroundColor},
      ]}>
      <View style={[styles.ph24, styles.container]}>
        <View style={[styles.rowBetween]}>
          <View>
            <Text style={[styles.fonts_SVN_Cherish, styles.textTitle]}>
              VIETNAMESE
            </Text>
            <Text style={[styles.fonts_SVN_Cherish, styles.textModule]}>
              {layout.module}
            </Text>
          </View>
          <View style={styles.alightEnd}>
            <View style={[styles.boxPrice]}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>
                FREE
              </Text>
              <IconDiamond />
            </View>
            <View style={styles.rowAlignCenter}>
              <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>
                150
              </Text>
              <IconStar />
            </View>
          </View>
        </View>
        <View style={[styles.boxQuestion, styles.pb32]}>
          {layout.buildQuestion}
        </View>
        <View style={[styles.tabs]}>
          {Array.from({length: listLayouts.length}, (_, i) => {
            const bg =
              i < layoutIndex
                ? 'white'
                : i === layoutIndex
                ? '#F2B559'
                : '#258F78';
            return <Dotline key={i} bg={bg} />;
          })}
        </View>
      </View>
      <View style={[styles.h450]}>
        <View style={styles.backgroundAnswer}>
          <View
            style={[
              styles.backgroundLeft,
              {backgroundColor: layout.backgroundAnswerColor},
            ]}
          />
          <View
            style={[
              styles.backgroundRight,
              {backgroundColor: layout.backgroundAnswerColor},
            ]}
          />
        </View>
        <View style={[styles.boxAnswer]}>{layout.buildAnswer}</View>
      </View>
    </View>
  );
};

const Dotline = ({bg}: {bg: string}) => {
  return <View style={[styles.dotline, {backgroundColor: bg}]} />;
};

export default LessonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#66c270',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  h450: {
    height: 450,
  },
  p16: {
    padding: 16,
  },
  pb16: {
    paddingBottom: 16,
  },
  ph24: {
    paddingHorizontal: 24,
  },
  pb32: {
    paddingBottom: 32,
  },
  pv32: {
    paddingVertical: 32,
  },
  ph32: {
    paddingHorizontal: 32,
  },
  mt32: {
    marginTop: 32,
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textTitle: {
    fontSize: 40,
    color: 'white',
  },
  alightEnd: {
    alignItems: 'flex-end',
  },
  textModule: {
    fontSize: 20,
    color: '#258F78',
  },
  boxPrice: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
    padding: 6,
    width: 90,
    backgroundColor: '#FFE699',
  },
  textPrice: {
    fontSize: 18,
    color: '#1C6349',
    paddingHorizontal: 16,
  },
  boxQuestion: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
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
  boxAnswer: {
    flex: 1,
    padding: 32,
  },
  backgroundAnswer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  backgroundLeft: {
    backgroundColor: '#DDF598',
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 40,
  },
  backgroundRight: {
    backgroundColor: '#DDF598',
    flex: 1,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 16,
  },
  textW500s16White: {
    fontWeight: '500',
    fontSize: 16,
    color: 'white',
  },
  textW500s16Black: {
    fontWeight: '500',
    fontSize: 16,
    color: 'black',
  },
  dotline: {
    height: 6,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 3,
  },
  tabs: {
    flexDirection: 'row',
    paddingBottom: 14,
  },
});
