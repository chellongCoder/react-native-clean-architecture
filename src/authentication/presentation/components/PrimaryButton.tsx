import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {scale} from 'react-native-size-matters';

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>;
  wrapContent?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

const PrimaryButton = (props: Props) => {
  const commonStyle = useGlobalStyle();

  const alignSelf = props.wrapContent ?? true ? 'center' : 'auto';

  return (
    <>
      <TouchableOpacity
        style={[styles.button, {alignSelf: alignSelf}, props.style]}
        onPress={props.onPress}
        disabled={props.disabled}>
        <Text style={[styles.text, commonStyle.txtLabel]}>{props.text}</Text>
      </TouchableOpacity>
    </>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#66C270',
    paddingVertical: scale(12),
    paddingHorizontal: scale(32),
    borderRadius: scale(87),
    alignItems: 'center',
    marginBottom: scale(8),
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});
