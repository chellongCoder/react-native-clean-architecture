import React, {useCallback} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {observer} from 'mobx-react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CommonInput, {CommonInputPassword} from '../components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import useLoginWithCredentials from '../hooks/useLoginWithCredentials';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import useStateCustom from 'src/hooks/useStateCommon';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {COLORS} from 'src/core/presentation/constants/colors';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';

interface TRegisterError {
  emailOrPhoneError?: string;
  userNameError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
}

interface TRegister {
  emailOrPhone?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  error?: TRegisterError;
  isFormFilled?: boolean;
}

const initialRegisterState: TRegister = {
  emailOrPhone: '',
  userName: '',
  password: '',
  confirmPassword: '',
  error: undefined,
  isFormFilled: false,
};

const RegisterScreen: React.FC = observer(() => {
  const commonStyle = useGlobalStyle();
  const {handleRegister} = useLoginWithCredentials();
  useLoadingGlobal();

  const [registerState, setRegisterState] =
    useStateCustom<TRegister>(initialRegisterState);

  const validateEmailOrPhone = (value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d+$/;

    if (value[0] >= '0' && value[0] <= '9') {
      return phoneRegex.test(value) ? undefined : 'Invalid phone number format';
    } else {
      return emailRegex.test(value) ? undefined : 'Invalid email format';
    }
  };

  const validateFields = useCallback(async (): Promise<boolean> => {
    const {emailOrPhone, userName, password, confirmPassword} = registerState;
    const errors: TRegisterError = {};

    errors.emailOrPhoneError = emailOrPhone
      ? validateEmailOrPhone(emailOrPhone)
      : 'Email or phone number is required';

    errors.userNameError = userName ? '' : 'User Name is required';
    if (!password) {
      errors.passwordError = 'Password is required';
    } else if (!confirmPassword) {
      errors.confirmPasswordError = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errors.passwordError = 'Password is not the same as confirm password';
      errors.confirmPasswordError =
        'Confirm password is not the same as password';
    } else {
      errors.passwordError = '';
      errors.confirmPasswordError = '';
    }

    const isFormFilled = [
      emailOrPhone,
      userName,
      password,
      confirmPassword,
    ].every(Boolean);
    setRegisterState({
      error: Object.keys(errors).length ? errors : undefined,
      isFormFilled,
    });

    return Object.values(errors).every(error => !error);
  }, [registerState, setRegisterState]);

  const onRegister = useCallback(async (): Promise<void> => {
    const isValid = await validateFields();
    if (isValid) {
      const params: RegisterPayload = {
        emailOrPhoneNumber: registerState.emailOrPhone?.toLowerCase() || '',
        username: registerState.userName?.toLowerCase() || '',
        password: registerState.password || '',
        confirmPassword: registerState.confirmPassword || '',
        name: 'string',
        gender: 'male',
        address: 'string',
        phone: 'string',
      };
      handleRegister(params);
    }
  }, [
    validateFields,
    registerState.emailOrPhone,
    registerState.userName,
    registerState.password,
    registerState.confirmPassword,
    handleRegister,
  ]);

  const onTextInputChange = useCallback(
    (key: string, value: string): void => {
      setRegisterState({
        [key]: value,
        error: {
          ...registerState.error,
          [`${key}Error`]: undefined,
        },
      });
    },
    [registerState.error, setRegisterState],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.fill}>
        <View style={styles.boxLang}>
          <Text style={[commonStyle.txtLabel, styles.ph16]}>Eng</Text>
          <View style={styles.arrowIcon} />
        </View>
        <KeyboardAvoidingView
          style={[styles.fill, styles.justifyCenter]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <CommonInput
            label="Email or phone number"
            textInputProp={{
              placeholder: 'Enter email or phone number',
              value: registerState.emailOrPhone,
              onChangeText: (e: string) => onTextInputChange('emailOrPhone', e),
            }}
            suffiex={
              registerState.error?.emailOrPhoneError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error.emailOrPhoneError}
                </Text>
              )
            }
          />
          <CommonInput
            label="User Name"
            textInputProp={{
              placeholder: 'Enter name',
              value: registerState.userName,
              onChangeText: (e: string) => onTextInputChange('userName', e),
            }}
            suffiex={
              registerState.error?.userNameError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error.userNameError}
                </Text>
              )
            }
          />
          <CommonInputPassword
            label="Enter password"
            textInputProp={{
              value: registerState.password,
              onChangeText: (e: string) => onTextInputChange('password', e),
            }}
            suffiex={
              registerState.error?.passwordError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error.passwordError}
                </Text>
              )
            }
          />
          <CommonInputPassword
            label="Confirm password"
            textInputProp={{
              value: registerState.confirmPassword,
              onChangeText: (e: string) =>
                onTextInputChange('confirmPassword', e),
            }}
            suffiex={
              registerState.error?.confirmPasswordError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error.confirmPasswordError}
                </Text>
              )
            }
          />
        </KeyboardAvoidingView>
        <View style={styles.rowAround}>
          <PrimaryButton text="Log in" onPress={goBack} />
          <PrimaryButton text="Next" onPress={onRegister} />
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbf8cc',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  boxLang: {
    backgroundColor: '#FFE699',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 40,
    padding: 5,
    borderRadius: 30,
  },
  arrowIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  ph16: {
    paddingHorizontal: 16,
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  errorMsg: {
    ...CustomTextStyle.body2,
    color: COLORS.ERROR,
  },
});

export default RegisterScreen;
