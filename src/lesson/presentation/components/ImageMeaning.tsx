import React, {useState} from 'react';
import {Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';

const ImageMeaning = ({descriptionImage, image}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService
  const [isShowMeaning, setIsShowMeaning] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => setIsShowMeaning(v => !v)}>
      <Image
        resizeMode={'contain'}
        width={WIDTH_SCREEN}
        style={[
          {
            width: WIDTH_SCREEN,
            height: scale(150),
          },
        ]}
        source={{
          uri:
            env.IMAGE_QUESTION_BASE_API_URL +
            (isShowMeaning ? descriptionImage : image),
        }}
      />
    </TouchableWithoutFeedback>
  );
};

export default ImageMeaning;
