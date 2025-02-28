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
}

const LearningImage: React.FC<ImageCarouselProps> = ({
  images,
  styleContainer = {},
}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000 / images.length); // Change image every 1 second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

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
