import React, {useCallback} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {observer} from 'mobx-react';
import CommonInput, {CommonInputPassword} from '../components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import useLoginWithCredentials from '../hooks/useLoginWithCredentials';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import useStateCustom from 'src/hooks/useStateCommon';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import {COLORS} from 'src/core/presentation/constants/colors';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {scale} from 'react-native-size-matters';
import {useI18n} from 'src/core/presentation/hooks/useI18n';
import DropdownChangeLang from 'src/core/presentation/components/DropdownChangeLang';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  const {handleRegister} = useLoginWithCredentials();
  useLoadingGlobal();
  const i18n = useI18n();
  const insets = useSafeAreaInsets();

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
    <ImageBackground
      style={[[styles.container, {paddingTop: insets.top}]]}
      source={require('../../../../assets/images/authBackground.webp')}>
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.fill}>
        <View style={{zIndex: 999}}>
          <DropdownChangeLang />
        </View>
        <KeyboardAvoidingView
          style={[styles.fill, styles.justifyCenter]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <CommonInput
            label={i18n.t('authentication.screens.Register.emailOrPhone')}
            textInputProp={{
              placeholder: i18n.t(
                'authentication.screens.Register.enterEmailOrPhone',
              ),
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
            label={i18n.t('authentication.screens.Register.userName')}
            textInputProp={{
              placeholder: i18n.t(
                'authentication.screens.Register.enterUserName',
              ),
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
            label={i18n.t('authentication.screens.Register.password')}
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
            label={i18n.t('authentication.screens.Register.confirmPassword')}
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
        <View style={[styles.rowAround, {marginBottom: insets.bottom}]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <PrimaryButton
              text={i18n.t('authentication.screens.Register.logIn')}
              onPress={goBack}
              style={{backgroundColor: COLORS.YELLOW_F2B559}}
            />
            <Text style={styles.subTitle}>
              {i18n.t('authentication.screens.Register.alreadyHaveAccount')}
            </Text>
          </View>

          <PrimaryButton
            text={i18n.t('authentication.screens.Register.next')}
            onPress={onRegister}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // This makes the overlay fill the entire ImageBackground
    backgroundColor: COLORS.WHITE_FBF8CC, // Adjust the color and opacity as needed
    opacity: 0.9,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(30),
  },

  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  errorMsg: {
    ...CustomTextStyle.body2,
    color: COLORS.ERROR,
  },
  subTitle: {
    color: COLORS.BLUE_1C6349,
    fontFamily: FontFamily.SVNNeuzeitRegular,
    fontSize: scale(10),
  },
});

export default RegisterScreen;
