import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
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
import {assets, isAndroid} from 'src/core/presentation/utils';
import {useLessonStore} from 'src/lesson/presentation/stores/LessonStore/useGetPostsStore';
import {listLanguage} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import Tts from 'react-native-tts';
import {iosVoice} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechProvider';
import {TextToSpeechContext} from 'src/core/presentation/hooks/textToSpeech/TextToSpeechContext';
import FastImage from 'react-native-fast-image';

const {width: screenWidth} = Dimensions.get('window');

interface FieldData {
  _id: string;
  name: string;
  description: string;
  image: string;
}
const ListLesson = () => {
  const {listSubject, setSubjectId, rootSubject, listModule} = useHomeStore();
  const lessonStore = useLessonStore();
  const {getData, isConnected} = useOfflineMode();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService
  const {updateDefaultVoice} = useContext(TextToSpeechContext);

  const carouselRef = useRef<Carousel>();

  // Debounced navigation functions
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const debouncedSnapToPrev = () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      snapToPrev();
      setTimeout(() => setIsButtonDisabled(false), 1000); // 500ms debounce time
    }
  };

  const debouncedSnapToNext = () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      snapToNext();
      setTimeout(() => setIsButtonDisabled(false), 1000); // 500ms debounce time
    }
  };
  const renderItem = ({item}: {item: FieldData}) => {
    return (
      <TouchableOpacity style={styles.wrapLessonContainer} activeOpacity={0.9}>
        {/* <Text style={styles.lessonTitle}>{item.name}</Text> */}
        <FastImage
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

  const changeSpeakLanguage = (index: number) => {
    console.log(
      '🛠 LOG: 🚀 --> ----------------------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log('🛠 LOG: 🚀 --> ~ changeSpeakLanguage ~ index:', index, data);
    console.log(
      '🛠 LOG: 🚀 --> ----------------------------------------------------🛠 LOG: 🚀 -->',
    );
    Tts.voices().then(voices => {
      if (data[index].description.toLocaleLowerCase().includes('english')) {
        const engVoice = voices.find(
          voice => voice.language === listLanguage['US English'],
        );
        updateDefaultVoice?.(
          isAndroid ? engVoice?.id : iosVoice[3].id,
          'US English',
        );
      } else if (
        data[index].description.toLocaleLowerCase().includes('mandarin')
      ) {
        const engVoice = voices.find(
          voice =>
            voice.language ===
            listLanguage['Mainland China, simplified characters'],
        );
        updateDefaultVoice?.(
          engVoice?.id,
          'Mainland China, simplified characters',
        );
      } else if (
        data[index].description.toLocaleLowerCase().includes('vietnamese')
      ) {
        const vietnameseVoices = voices.filter(
          voice =>
            voice.language.startsWith('vi-') ||
            voice.name.toLowerCase().includes('vietnamese'),
        );

        updateDefaultVoice?.(vietnameseVoices[0]?.id, 'Vie (Vietnamese)');
      } else {
        const engVoice = voices.find(
          voice => voice.language === listLanguage['US English'],
        );
        updateDefaultVoice?.(
          isAndroid ? engVoice?.id : iosVoice[3].id,
          'US English',
        );
      }
    });
  };

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.LIST_SUBJECT);
        setSubjects(res);
      }
    };

    getDataFromStore();
  }, [getData, isConnected]);

  useEffect(() => {
    setTimeout(() => {
      const index = data.findIndex(e => e._id === rootSubject?._id);
      carouselRef?.current?.snapToItem(index);
      changeSpeakLanguage(index < 0 ? 0 : index);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const handleGetUserModule = async () => {
      try {
        await lessonStore.handleGetUserModule(listModule);
      } catch (error) {
        console.log('error', error);
      }
    };
    handleGetUserModule();
  }, [lessonStore, listModule]);

  useEffect(() => {
    return () => {
      setSubjectId('');
    };
  }, [setSubjectId]);

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
          setSubjectId(data[slideIndex]?._id);
          changeSpeakLanguage(slideIndex);
        }}
      />

      <View style={styles.arrowContainer}>
        <TouchableOpacity
          style={styles.arrow}
          hitSlop={styles.hitSlop}
          onPress={debouncedSnapToPrev}
        />
        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          hitSlop={styles.hitSlop}
          onPress={debouncedSnapToNext}
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
