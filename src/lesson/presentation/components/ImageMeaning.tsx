import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';

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
      <FastImage
        resizeMode={'contain'}
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
