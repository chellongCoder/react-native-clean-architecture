import {Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {assets} from 'src/core/presentation/utils';
import {scale, verticalScale} from 'react-native-size-matters';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const VoiceButton = ({onPress, disabled}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Image
        source={assets.icon_speech}
        style={{
          height: verticalScale(40),
          width: scale(35),
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default VoiceButton;
