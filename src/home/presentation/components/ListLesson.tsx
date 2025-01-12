/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import useHomeStore from '../stores/useHomeStore';
import {useOfflineMode} from 'src/core/presentation/hooks/offline/useOfflineMode';
import {OfflineEnum} from 'src/core/presentation/hooks/offline/OfflineEnum';
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';

const {width: screenWidth} = Dimensions.get('window');

const ListLesson = () => {
  const {listSubject, setSubjectId} = useHomeStore();
  const {getData, isConnected} = useOfflineMode();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.LIST_SUBJECT);
        setSubjects(res);
      }
    };

    getDataFromStore();
  }, [getData, isConnected]);

  const itemSize = screenWidth / 2;
  const centerOffset = screenWidth / 2 - itemSize / 2;

  const dataLength = 18;

  const sideItemCount = 3;
  const sideItemWidth = (screenWidth - itemSize) / (sideItemCount - 1);

  const animationStyle = React.useCallback(
    (value: number) => {
      'worklet';

      const itemOffsetInput = new Array(sideItemCount * 2 + 1)
        .fill(null)
        .map((_, index) => index - sideItemCount);

      const itemOffset = interpolate(
        value,
        // e.g. [0,1,2,3,4,5,6] -> [-3,-2,-1,0,1,2,3]
        itemOffsetInput,
        itemOffsetInput.map(item => {
          if (item < 0) {
            return (-itemSize + sideItemWidth) * Math.abs(item);
          }

          if (item > 0) {
            return (itemSize - sideItemWidth) * (Math.abs(item) - 1);
          }

          return 0;
        }) as number[],
      );

      const translate =
        interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) +
        centerOffset -
        itemOffset;

      const width = interpolate(
        value,
        [-1, 0, 1],
        [sideItemWidth, itemSize, sideItemWidth],
        Extrapolation.CLAMP,
      );

      const backgroundColor = interpolateColor(
        value,
        [-3, -2, -1, 0, 1, 2, 3],
        [
          '#7dcf86',
          '#7dcf86',
          '#3ab89c',
          '#258f78',
          '#3ab89c',
          '#7dcf86',
          '#7dcf86',
        ],
      );

      return {
        transform: [
          {
            translateX: translate,
          },
        ],
        width,
        backgroundColor,
        overflow: 'hidden',
      };
    },
    [centerOffset, itemSize, sideItemWidth, sideItemCount],
  );

  const data = useMemo(
    () =>
      listSubject?.length !== 0 ? [...listSubject, ...listSubject] : subjects,
    [listSubject, subjects],
  );

  return (
    <View style={styles.container}>
      <Carousel
        width={itemSize}
        height={scale(232)}
        style={{
          width: screenWidth,
          height: scale(232),
        }}
        loop
        windowSize={Math.round(dataLength / 2)}
        scrollAnimationDuration={500}
        autoPlayInterval={1200}
        data={data}
        renderItem={({index, animationValue}) => (
          <Item
            animationValue={animationValue}
            item={data[index]}
            key={index}
          />
        )}
        customAnimation={animationStyle as any}
        onSnapToItem={(slideIndex: number) => {
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
          );
          console.log('🛠 LOG: 🚀 --> ~ ListLesson ~ slideIndex:', slideIndex);
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
          );
          setSubjectId(data[slideIndex]?._id);
        }}
      />

      {/* <View style={styles.arrowContainer}>
        <TouchableOpacity
          style={styles.arrow}
          hitSlop={styles.hitSlop}
          onPress={snapToPrev}
        />
        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          hitSlop={styles.hitSlop}
          onPress={snapToNext}
        />
      </View> */}
    </View>
  );
};

const Item: React.FC<{
  item: Subject;
  animationValue: SharedValue<number>;
}> = ({item}) => {
  return (
    <View style={[{flex: 1, width: '100%', height: '100%'}]}>
      <TouchableOpacity style={styles.wrapLessonContainer} activeOpacity={0.9}>
        <Text style={styles.lessonTitle}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scale(16),
  },
  wrapLessonContainer: {
    height: scale(232),
    borderRadius: scale(30),
    // backgroundColor: COLORS.BLUE_258F78,
    alignItems: 'center',
    alignContent: 'center',
  },
  lessonTitle: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    color: COLORS.YELLOW_FFBF60,
    marginTop: scale(48),
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: scale(16),
  },
  arrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: scale(10),
    borderBottomWidth: scale(10),
    borderRightWidth: scale(12),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#1C6349',
  },
  arrowRight: {
    transform: [{rotate: '180deg'}], // Xoay tam giác nếu cần
  },
  hitSlop: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlayTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListLesson;
