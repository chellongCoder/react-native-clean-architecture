import {Image} from 'react-native';
import React from 'react';
import {ICprops} from '.';
import {assets} from 'src/core/presentation/utils';

export const ICabcBook = ({color, height, width}: ICprops) => {
  return (
    <Image
      source={assets.abcBook}
      style={{height: height ?? '100%', width: width ?? '100%'}}
      tintColor={color}
      resizeMode="contain"
    />
  );
};
