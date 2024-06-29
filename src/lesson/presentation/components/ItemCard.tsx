import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconBlock from 'assets/svg/IconBlock';
import {Image} from 'react-native';
import {COLORS} from 'src/core/presentation/utils/colors';

export type ItemCardProps = {
  name?: string;
  Icon:
    | string
    | React.ComponentType<{color?: string; height?: number; width?: number}>;
  isFocus?: boolean;
  size?: number;
  onPress?: () => void;
  backgroundColor?: string;
  backgroundFocusColor?: string;
  iconFocusColor?: string;
  borderWidth?: number;
  space?: number;
};

const ItemCard = ({
  name,
  Icon,
  isFocus,
  size = 64,
  onPress,
  backgroundColor = '#258F78',
  backgroundFocusColor = '#F2B559',
  iconFocusColor = '#FBF8CC',
  borderWidth = 0,
  space = 8,
}: ItemCardProps) => {
  const globalStyle = useGlobalStyle();

  const bg = isFocus ? backgroundFocusColor : backgroundColor;
  const ic = isFocus ? iconFocusColor : '#FBF8CC';
  const bc = backgroundColor;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: bg,
            borderColor: bc,
            borderWidth: borderWidth,
            height: size,
            width: size,
          },
        ]}>
        {typeof Icon === 'string' && (
          <>
            <View style={{position: 'absolute'}}>
              {Icon === 'no_icon' ? (
                <Text style={[globalStyle.txtWord, {color: COLORS.WHITE}]}>
                  {name}
                </Text>
              ) : (
                <Image
                  source={{uri: `data:image/jpg;base64,${Icon}`}}
                  width={50}
                  height={50}
                />
              )}
            </View>
            <IconBlock color={ic} height={size / 2} width={size / 2} />
          </>
        )}
        {typeof Icon !== 'string' && (
          <>
            <Icon color={ic} height={size / 2} width={size / 2} />
          </>
        )}
      </View>
      {name && (
        <Text style={[globalStyle.txtButton, styles.name, {paddingTop: space}]}>
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  card: {
    height: 64,
    width: 64,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#258F78',
  },
  name: {
    textAlign: 'center',
    color: '#1C6349',
  },
});
