import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {COLORS} from 'src/core/presentation/constants/colors';

type ButtonProps = {
  color: string;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};
const Button = (props: Partial<ButtonProps>) => {
  const globalStyle = useGlobalStyle();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, {backgroundColor: props.color}]}>
      <Text style={[globalStyle.txtButton, {color: COLORS.WHITE}]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: scale(70.23),
    height: verticalScale(28),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
