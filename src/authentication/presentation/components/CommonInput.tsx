import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  TextStyle,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Pressable,
} from 'react-native';
import React, {useRef, useState} from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

type Props = {
  textInputProp?: TextInputProps;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  suffiex?: React.ReactNode;
};

const CommonInput = (props: Props) => {
  const commonStyle = useGlobalStyle();

  return (
    <View style={styles.pb32}>
      <Text style={[commonStyle.txtLabel, styles.txtLabel]}>{props.label}</Text>
      <View style={styles.boxInput}>
        <TextInput style={[styles.input]} {...props.textInputProp} />
      </View>
      {props.suffiex}
    </View>
  );
};

export const CommonInputPassword = (props: Props) => {
  const [password, setPassword] = useState('');
  const commonStyle = useGlobalStyle();
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const onChangeText = (text: string) => {
    props.textInputProp?.onChangeText?.(text);
  };

  const onChangePassword = (text: string, index: number) => {
    if (text.trim() !== '') {
      const newPassword = [...password];
      newPassword[index] = text;

      setPassword(newPassword.join(''));
      onChangeText(newPassword.join(''));

      if (index < refs.length - 1) {
        refs[index + 1]?.current?.focus();
      } else {
        Keyboard.dismiss();
      }
    } else if (text === '') {
      if (index > 0) {
        const newPassword = [...password];
        newPassword[index - 1] = '';
        setPassword(newPassword.join(''));
        onChangeText(newPassword.join(''));
        refs[index - 1]?.current?.focus();
      }
    }
  };

  const handleKeyPress = (
    {nativeEvent}: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const newPassword: string[] = [...password];

    if (nativeEvent.key === 'Backspace') {
      if (!password[index] && index > 0) {
        newPassword[index - 1] = '';
        setPassword(newPassword.join(''));

        refs[index - 1]?.current?.focus();
      } else if (!password[index] && index === 0) {
        newPassword.shift();
        setPassword(newPassword.join(''));
      } else {
        newPassword[index] = '';
        setPassword(newPassword.join(''));
      }
    }
  };

  const onPress = () => {
    const length = password.length;
    const index = length >= 4 ? length - 1 : length;
    refs[index].current?.focus();
  };

  return (
    <View style={styles.pb32}>
      <Text style={[commonStyle.txtLabel, styles.txtLabel]}>{props.label}</Text>
      <View style={[styles.rowBetween]}>
        <Pressable style={[styles.rowBetween, styles.fill]} onPress={onPress}>
          {refs.map((r, i) => {
            return (
              <View
                style={[styles.boxInput, styles.w64]}
                key={i}
                pointerEvents="none">
                <TextInput
                  value={password[i] ?? ''}
                  onChangeText={t => onChangePassword(t, i)}
                  ref={r}
                  style={[styles.inputPassword]}
                  maxLength={1}
                  onKeyPress={e => handleKeyPress(e, i)}
                  secureTextEntry
                />
              </View>
            );
          })}
        </Pressable>
      </View>
      {props.suffiex}
    </View>
  );
};

export default CommonInput;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  boxInput: {
    backgroundColor: '#DDF598',
    height: 64,
    borderRadius: 15,
    flexDirection: 'row',
  },
  txtLabel: {
    color: '#1C6349',
    paddingBottom: 8,
  },
  input: {
    padding: 22,
  },
  inputPassword: {
    flex: 1,
    textAlign: 'center',
  },
  w64: {
    width: 64,
  },
  pb8: {
    paddingBottom: 8,
  },
  pb32: {
    paddingBottom: 32,
  },
  ph16: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
