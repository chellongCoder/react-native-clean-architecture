import React, {useState} from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

const ImageMeaning = ({descriptionImage, image}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  const [isShowMeaning, setIsShowMeaning] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        borderWidth: 5,
        backgroundColor: COLORS.CUSTOM(COLORS.WHITE_FBF8CC, 0.2),
        borderStyle: 'dashed',
        width: scale(150),
        height: scale(150),
        borderRadius: scale(20),
        borderColor: COLORS.YELLOW_F2B559,
        overflow: 'hidden',
      }}
      onPress={() => setIsShowMeaning(v => !v)}>
      <Image
        resizeMode={'contain'}
        width={WIDTH_SCREEN}
        style={[
          {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: scale(20),
          },
        ]}
        source={{
          uri:
            env.IMAGE_QUESTION_BASE_API_URL +
            (isShowMeaning ? descriptionImage : image),
        }}
      />
    </TouchableOpacity>
  );
};

export default ImageMeaning;
