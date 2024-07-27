import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/utils/colors';

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>;
  wrapContent?: boolean;
  onPress?: () => void;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  disable?: boolean;
};

const PrimaryButton = ({isLoading = false, ...props}: Props) => {
  const commonStyle = useGlobalStyle();

  const alignSelf = props.wrapContent ?? true ? 'center' : 'auto';

  return (
    <TouchableOpacity
      style={[styles.button, {alignSelf: alignSelf}, props.style]}
      onPress={props.onPress}
      disabled={props.disable}>
      <Text style={[styles.text, commonStyle.txtButton, props.textStyle]}>
        {props.text}
      </Text>
      {isLoading && (
        <View style={{paddingLeft: 10}}>
          <ActivityIndicator color={COLORS.WHITE} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#66C270',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(32),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
