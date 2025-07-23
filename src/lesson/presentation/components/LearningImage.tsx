import React, {useState, useEffect} from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

interface ImageCarouselProps {
  images: string[];
  styleContainer?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  totalSeconds?: number;
  onChangeIndex?: (index: number) => void;
  isShowBorder?: boolean;
  title?: string;
}

const LearningImage: React.FC<ImageCarouselProps> = ({
  images,
  styleContainer = {},
  titleStyle = {},
  totalSeconds = 5,
  onChangeIndex,
  isShowBorder = true,
  title,
}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % images.length;
        onChangeIndex?.(nextIndex);
        return nextIndex;
      });
    }, (totalSeconds * 1000) / images.length); // Change image every 1 second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length, onChangeIndex, totalSeconds]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  return (
    <View
      style={[
        {width: scale(180), aspectRatio: 1, justifyContent: 'space-evenly'},
        isShowBorder && {
          borderWidth: scale(5),
          backgroundColor: COLORS.CUSTOM(COLORS.WHITE_FBF8CC, 0.2),
          borderStyle: 'dashed',
          borderRadius: scale(20),
          borderColor: COLORS.YELLOW_F2B559,
          overflow: 'hidden',
        },
        styleContainer,
      ]}>
      {title && (
        <Text
          style={[
            {
              fontSize: scale(24),
              fontFamily: FontFamily.SVNCherishMoment,
              textAlign: 'center',
            },
            titleStyle,
          ]}>
          {title}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            width: scale(180),
            aspectRatio: 2,
          },
        ]}>
        <FastImage
          resizeMode={'contain'}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: scale(20),
          }}
          source={{uri: env.IMAGE_QUESTION_BASE_API_URL + images[currentIndex]}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LearningImage;
