import {Image} from 'react-native';
import React from 'react';
import {ICprops} from '.';
import {assets} from 'src/core/presentation/utils';

export const ICpurchase = ({color, height, width}: ICprops) => {
  return (
    <Image
      source={assets.purchase_icon}
      style={{height: height, width: width}}
      tintColor={color}
      resizeMode="contain"
    />
  );
};
