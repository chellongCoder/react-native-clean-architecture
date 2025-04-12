import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {assets} from 'src/core/presentation/utils';

type SpeakerProps = {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  iconSource?: ImageSourcePropType;
  size?: number;
  borderColor?: string;
};

const Speaker = ({
  onPress,
  containerStyle,
  iconStyle,
  iconSource = assets.sound_icon,
  size = 40,
  borderColor = '#AAEDBA',
}: SpeakerProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.soundButton,
        {width: scale(size), height: scale(size), borderColor},
        containerStyle,
      ]}
      onPress={onPress}>
      <Image source={iconSource} style={[styles.soundIcon, iconStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  soundButton: {
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(2),
    aspectRatio: 1,
  },
  soundIcon: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
});

export default Speaker;
