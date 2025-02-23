import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import useHomeStore from '../stores/useHomeStore';
import Carousel from 'react-native-snap-carousel';
import {useOfflineMode} from 'src/core/presentation/hooks/offline/useOfflineMode';
import {OfflineEnum} from 'src/core/presentation/hooks/offline/OfflineEnum';
import {
  Subject,
  TypeSubject,
} from 'src/home/application/types/GetListSubjectResponse';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {assets} from 'src/core/presentation/utils';

const {width: screenWidth} = Dimensions.get('window');

interface FieldData {
  _id: string;
  name: string;
  description: string;
  image: string;
}
const ListLesson = () => {
  const {listSubject, setSubjectId, subjectId, rootSubject} = useHomeStore();

  const {getData, isConnected} = useOfflineMode();
  const [subjectIndex, setSubjectIndex] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const carouselRef = useRef<Carousel>();

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.LIST_SUBJECT);
        setSubjects(res);
      }
    };

    getDataFromStore();
  }, [getData, isConnected]);

  const renderItem = ({item}: {item: FieldData}) => {
    return (
      <TouchableOpacity style={styles.wrapLessonContainer} activeOpacity={0.9}>
        {/* <Text style={styles.lessonTitle}>{item.name}</Text> */}
        <Image
          source={{uri: env.IMAGE_MODULE_BASE_API_URL + item.image}}
          style={styles.imageSlide}
          resizeMode="cover"
          onError={() => {
            // Show your default image
            console.log('Error loading image', item.image);
          }}
          defaultSource={assets.onboarding}
        />
      </TouchableOpacity>
    );
  };

  const snapToPrev = () => {
    carouselRef.current.snapToPrev();
  };

  const snapToNext = () => {
    carouselRef.current.snapToNext();
  };

  const data = useMemo(() => {
    return (listSubject?.length !== 0 ? listSubject : subjects).filter(
      e => e.type === TypeSubject.ROOT,
    );
  }, [listSubject, subjects]);

  const slideIndex = useMemo(
    () => data.findIndex(e => e._id === rootSubject?._id),
    [data, rootSubject?._id],
  );

  // * nếu chưa có subject id nào thì lấy thằng đầu tiên
  useEffect(() => {
    if (subjectId === '') {
      setSubjectId(data[0]?._id);
    }
  }, [data, setSubjectId, subjectId]);

  useEffect(() => {
    setTimeout(() => {
      const index = data.findIndex(e => e._id === rootSubject?._id);
      carouselRef.current.snapToItem(index);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={data}
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
        firstItem={slideIndex}
        onSnapToItem={(slideIndex: number) => {
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
          );
          console.log('🛠 LOG: 🚀 --> ~ ListLesson ~ slideIndex:', slideIndex);
          console.log(
            '🛠 LOG: 🚀 --> -----------------------------------------------------🛠 LOG: 🚀 -->',
          );
          setSubjectIndex(slideIndex);
          setSubjectId(data[slideIndex]?._id);
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
  imageSlide: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: scale(2),
  },
});

export default ListLesson;
