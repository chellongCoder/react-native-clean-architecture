import React, {useState} from 'react';
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

  const renderItem = ({item}: {item: FieldData}) => {
    return (
      <TouchableOpacity style={styles.wrapLessonContainer}>
        <Text style={styles.lessonTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={listSubject}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.5}
        layout={'default'}
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
    backgroundColor: COLORS.BLUE_258F78,
    alignItems: 'center',
    alignContent: 'center',
  },
  lessonTitle: {
    ...CustomTextStyle.h1_SVNCherishMoment,
    color: COLORS.YELLOW_FFBF60,
    marginTop: scale(48),
  },
});

export default ListLesson;
