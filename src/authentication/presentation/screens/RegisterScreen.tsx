import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CommonInput, {CommonInputPassword} from '../components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {observer} from 'mobx-react';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import useLoginWithCredentials from '../hooks/useLoginWithCredentials';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';
import useStateCustom from 'src/hooks/useStateCommon';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {COLORS} from 'src/core/presentation/constants/colors';

type TRegisterError = {
  emailOrPhoneError?: string;
  userNameError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
};
interface TRegister {
  emailOrPhone?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  error?: TRegisterError;
  isFormFilled?: boolean;
}

const RegisterScreen = observer(() => {
  const commonStyle = useGlobalStyle();
  const {handleRegister} = useLoginWithCredentials();
  const {isLoading} = useAuthenticationStore();
  useLoadingGlobal(isLoading);

  const [registerState, setRegisterState] = useStateCustom<TRegister>({
    emailOrPhone: '',
    userName: '',
    password: '',
    confirmPassword: '',
    error: undefined,
    isFormFilled: false,
  });

  const validateFields = (key: string, value: string) => {
    const updatedState = {
      ...registerState,
      [key]: value,
    };

    const {emailOrPhone, userName, password, confirmPassword} = updatedState;
    const errors: TRegisterError = {};

    if (!emailOrPhone) {
      errors.emailOrPhoneError = 'Email or phone number is required';
    } else {
      errors.emailOrPhoneError = '';
    }

    if (!userName) {
      errors.userNameError = 'User Name is required';
    } else {
      errors.userNameError = '';
    }

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

    const isFilled = Object.values(updatedState).every(val => val !== '');
    setRegisterState({
      ...updatedState,
      error: Object.keys(errors).length > 0 ? errors : undefined,
      isFormFilled: isFilled,
    });

    return Object.values(errors).every(error => !error);
  };

  const onRegister = () => {
    if (
      registerState.error &&
      registerState.isFormFilled &&
      Object.values(registerState.error).every(error => error === '')
    ) {
      const params: RegisterPayload = {
        emailOrPhoneNumber: registerState.emailOrPhone || '',
        username: registerState.userName || '',
        password: registerState.password || '',
        confirmPassword: registerState.confirmPassword || '',
        name: 'string',
        gender: 'male',
        address: 'string',
        phone: 'string',
      };
      handleRegister(params);
    }
  };

  const onTextInputChange = (key: string, value: string) => {
    console.log('key: ', key);
    setRegisterState({
      [key]: value,
    });
    validateFields(key, value);
  };

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={[styles.fill]}>
        <View style={[styles.boxLang]}>
          <Text style={[commonStyle.txtLabel, styles.ph16]}>Eng</Text>
          <View style={[styles.arrowIcon]} />
        </View>

        <KeyboardAvoidingView
          style={[styles.fill, styles.justifyCenter]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <CommonInput
            label="Email or phone number"
            textInputProp={{
              placeholder: 'Enter email or phone number',
              value: registerState.emailOrPhone,
              onChangeText: (e: string) => {
                onTextInputChange('emailOrPhone', e);
              },
            }}
            suffiex={
              registerState.error &&
              registerState.error.emailOrPhoneError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error?.emailOrPhoneError}
                </Text>
              )
            }
          />

          <CommonInput
            label="User Name"
            textInputProp={{
              placeholder: 'Enter name',
              value: registerState.userName,
              onChangeText: (e: string) => {
                onTextInputChange('userName', e);
              },
            }}
            suffiex={
              registerState.error &&
              registerState.error.userNameError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error?.userNameError}
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
              registerState.error &&
              registerState.error.passwordError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error?.passwordError}
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
              registerState.error &&
              registerState.error.confirmPasswordError && (
                <Text style={styles.errorMsg}>
                  *{registerState.error?.confirmPasswordError}
                </Text>
              )
            }
          />
        </KeyboardAvoidingView>

        <View style={[styles.rowAround]}>
          <PrimaryButton text="Log in" onPress={goBack} />
          <PrimaryButton
            text="Next"
            onPress={onRegister}
            disabled={
              registerState.error &&
              Object.values(registerState.error).some(
                error => !!error && error.length > 0,
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
});

export default RegisterScreen;

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
