import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {scale} from 'react-native-size-matters';
import {coreModuleContainer} from 'src/core/CoreModule';
import {EnvToken} from 'src/core/domain/entities/Env';
import Env from 'src/core/domain/entities/Env';

type Props = {
  image: string;
};

const TextImage = ({image}: Props) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken); // Instantiate CoreService

  return (
    <View>
      <FastImage
        source={{uri: env.IMAGE_QUESTION_BASE_API_URL + image}}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    minHeight: scale(100),
  },
});

export default TextImage;
