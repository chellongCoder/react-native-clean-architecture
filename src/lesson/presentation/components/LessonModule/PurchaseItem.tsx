import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import PrimaryButton from '../PrimaryButton';
import {COLORS} from 'src/core/presentation/constants/colors';

type Props = {
  icon?: string | number;
  title: string;
  description?: string;
  isBorderTop?: boolean;
  onPress?: () => void;
};

const PurchaseItem = ({
  icon,
  title,
  description,
  isBorderTop,
  onPress,
}: Props) => {
  const styleGlobal = useGlobalStyle();
  const bbt = isBorderTop ? 2 : 0;
  return (
    <View style={[styles.item, {borderTopWidth: bbt}]}>
      <View style={[styles.containerIcon]}>
        <Image
          source={typeof icon === 'string' ? {uri: icon} : icon}
          style={[styles.icon]}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.content]}>
        <Text style={[styleGlobal.txtLabel, styles.text]}>{title}</Text>
        <Text style={[styleGlobal.txtNote, styles.text]}>{description}</Text>
      </View>
      <PrimaryButton
        text="Get more"
        wrapContent
        style={[styles.button]}
        onPress={onPress}
      />
    </View>
  );
};

export default PurchaseItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(6),
    borderTopColor: '#e5eac1',
  },
  containerIcon: {
    backgroundColor: '#F2B559',
    borderRadius: scale(8),
    width: scale(46),
    height: scale(46),
    padding: scale(8),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginHorizontal: scale(8),
  },
  text: {
    color: COLORS.GREEN_1C6349,
  },
  button: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(16),
  },
});
