import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import IconDiamond from 'assets/svg/IconDiamond';

const Price = ({price}: {price: string}) => {
  return (
    <View style={[styles.boxPrice]}>
      <Text style={[styles.fonts_SVN_Cherish, styles.textPrice]}>{price}</Text>
      <IconDiamond />
    </View>
  );
};

export default Price;

const styles = StyleSheet.create({
  boxPrice: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    borderRadius: 100,
    padding: 6,
    width: 90,
    backgroundColor: '#FFE699',
  },
  fonts_SVN_Cherish: {
    fontFamily: FontFamily.SVNCherishMoment,
  },
  textPrice: {
    fontSize: 18,
    color: '#1C6349',
    paddingHorizontal: 16,
  },
});
