import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

interface ImageCarouselProps {
  images: string[];
  styleContainer?: StyleProp<ViewStyle>;
  totalSeconds?: number;
  onChangeIndex?: (index: number) => void;
}

const LearningImage: React.FC<ImageCarouselProps> = ({
  images,
  styleContainer = {},
  totalSeconds = 5,
  onChangeIndex,
}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const [currentIndex, setCurrentIndex] = useState(0);

  console.log(currentIndex, 'ooooo');

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
    <TouchableOpacity
      activeOpacity={1}
      style={[
        {
          borderWidth: 5,
          backgroundColor: COLORS.CUSTOM(COLORS.WHITE_FBF8CC, 0.2),
          borderStyle: 'dashed',
          width: scale(150),
          aspectRatio: 1,
          borderRadius: scale(20),
          borderColor: COLORS.YELLOW_F2B559,
          overflow: 'hidden',
        },
        styleContainer,
      ]}>
      <Image
        resizeMode={'contain'}
        width={WIDTH_SCREEN}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: scale(20),
        }}
        source={{uri: env.IMAGE_QUESTION_BASE_API_URL + images[currentIndex]}}
      />
    </TouchableOpacity>
  );
};

export default LearningImage;
