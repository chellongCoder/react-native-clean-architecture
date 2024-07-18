import {Image} from 'react-native';
import React from 'react';
import {ICprops} from '.';
import {assets} from 'src/core/presentation/utils';

export const ICsetting = ({color, height, width}: ICprops) => {
  return (
    <Image
      source={assets.setting_icon}
      style={{height: height, width: width}}
      tintColor={color}
      resizeMode="contain"
    />
  );
};
