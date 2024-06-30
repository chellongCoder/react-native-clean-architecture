import React from 'react';
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
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import useHomeStore from '../stores/useHomeStore';
import Carousel from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');

interface FieldData {
  _id: string;
  name: string;
  description: string;
}

interface CarouselProps {
  data: FieldData[];
}

const CarouselComponent: React.FC<CarouselProps> = ({data}: {data: FieldData[]}) => {
  const renderItem = ({item}: {item: FieldData}) => {
    return (
      <TouchableOpacity style={styles.wrapLessonContainer}>
        <Text style={styles.lessonTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Carousel
      data={data}
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
    />
  );
};

const ListLesson = () => {
  const {listSubject} = useHomeStore();
  const onLeanLesson = () => {
    navigateScreen(STACK_NAVIGATOR.HOME.LESSON);
  };

  return (
    <View style={styles.container}>
      <CarouselComponent data={listSubject} />
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
