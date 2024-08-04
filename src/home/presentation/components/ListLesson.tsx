import React, {useRef, useState} from 'react';
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
import Carousel from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');

interface FieldData {
  _id: string;
  name: string;
  description: string;
}
const ListLesson = () => {
  const {listSubject, setSubjectId} = useHomeStore();
  const [subjectIndex, setSubjectIndex] = useState<number>(0);
  const carouselRef = useRef<Carousel>();

  const renderItem = ({item}: {item: FieldData}) => {
    return (
      <TouchableOpacity style={styles.wrapLessonContainer} activeOpacity={0.9}>
        <Text style={styles.lessonTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const snapToPrev = () => {
    carouselRef.current.snapToPrev();
  };

  const snapToNext = () => {
    carouselRef.current.snapToNext();
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={listSubject}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.5}
        itemHeight={scale(232)}
        layout={'abeeci'}
        loop={true}
        centerContent={true}
        removeClippedSubviews={false}
        apparitionDelay={0}
        windowSize={1}
        horizontal={true}
        onSnapToItem={(slideIndex: number) => {
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
          );
          console.log('🛠 LOG: 🚀 --> ~ ListLesson ~ slideIndex:', slideIndex);
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
          );
          setSubjectIndex(slideIndex);
          setSubjectId(listSubject[slideIndex]?._id);
        }}
      />

      <View style={styles.arrowContainer}>
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
      </View>
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
});

export default ListLesson;
