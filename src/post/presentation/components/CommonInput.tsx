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
  ViewStyle,
  InputModeOptions,
} from 'react-native';
import React, {Dispatch, useEffect, useRef, useState} from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import Dropdown from 'react-native-dropdown-picker';

type Props = {
  textInputProp?: TextInputProps;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  suffiex?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inputMode?: InputModeOptions;
  autoFocus?: boolean;
};

export type ItemType = {
  label: string;
  value: string | number;
};

type SetStateValue<S> = (prevState: S) => S;
type SetStateCallback<S> = (prevState: S) => S;

type DropDownProps = {
  label: string;
  open: boolean;
  items: ItemType[];
  value: string | number;
  setOpen: Dispatch<SetStateValue<boolean>>;
  setValue: Dispatch<SetStateCallback<any>>;
  setItems: Dispatch<SetStateCallback<any[]>>;
};

const CommonInput = (props: Props) => {
  const commonStyle = useGlobalStyle();

  return (
    <View style={[props.contentContainerStyle, styles.pb32]}>
      <Text style={[commonStyle.txtLabel, styles.txtLabel]}>{props.label}</Text>
      <View style={styles.boxInput}>
        <TextInput
          style={[styles.input]}
          {...props.textInputProp}
          inputMode={props.inputMode ?? 'none'}
          autoFocus={props.autoFocus ?? false}
        />
      </View>
      {props.suffiex}
    </View>
  );
};

export const CommonInputPassword = (props: Props) => {
  const [password, setPassword] = useState(props.textInputProp?.value ?? '');
  const commonStyle = useGlobalStyle();
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    props.textInputProp?.onChangeText?.(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, props.textInputProp?.onChangeText]);

  useEffect(() => {
    setPassword(props.textInputProp?.value ?? '');
  }, [props.textInputProp?.value]);

  const onChangePassword = (text: string, index: number) => {
    if (text.trim() !== '') {
      if (password.length < refs.length) {
        setPassword(password + text);
      }
      if (index < refs.length - 1) {
        refs[index + 1]?.current?.focus();
      } else {
        Keyboard.dismiss();
      }
    } else if (text === '') {
      setPassword(password.substring(0, password.length - 1));
    }
  };

  const handleKeyPress = (
    {nativeEvent}: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (nativeEvent.key === 'Backspace') {
      if (!password[index]) {
        setPassword(password.substring(0, password.length - 1));
        if (index > 0) {
          refs[index - 1]?.current?.focus();
        } else {
        }
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
          {refs.map((r, i) => (
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
              />
            </View>
          ))}
        </Pressable>
        {props.suffiex}
      </View>
    </View>
  );
};

export const CommonDropDown = (props: DropDownProps) => {
  const {label, open, value, items, setOpen, setValue, setItems} = props;
  const commonStyle = useGlobalStyle();

  return (
    <View style={{flex: 0.4, marginBottom: 32}}>
      <Text style={[commonStyle.txtLabel, styles.txtLabel]}>{label}</Text>
      <Dropdown
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={[styles.boxInput, {borderWidth: 0}]}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        zIndex={3000}
        zIndexInverse={1000}
      />
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
  dropDownContainerStyle: {
    backgroundColor: '#DDF598',
    borderWidth: 0,
  },
});
