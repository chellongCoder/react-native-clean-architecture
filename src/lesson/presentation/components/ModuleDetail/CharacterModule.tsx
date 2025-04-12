import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {scale} from 'react-native-size-matters';

type CharacterModuleProps = {
  imageSource: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

const CharacterModule = ({
  imageSource,
  containerStyle,
  imageStyle,
}: CharacterModuleProps) => {
  return (
    <View style={[styles.characterContainer, containerStyle]}>
      <Image source={imageSource} style={[styles.characterImage, imageStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  characterContainer: {
    position: 'absolute',
    bottom: -scale(15),
    left: -scale(20),
    width: scale(120),
    height: scale(170),
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default CharacterModule;
