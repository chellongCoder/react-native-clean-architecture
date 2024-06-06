import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import CommonInput, {CommonInputPassword} from '../components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {observer} from 'mobx-react';
import {goBack} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import useLoginWithCredentials from '../hooks/useLoginWithCredentials';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';

const RegisterScreen = observer(() => {
  const commonStyle = useGlobalStyle();
  const {handleRegister} = useLoginWithCredentials();
  const {isLoading} = useAuthenticationStore();
  useLoadingGlobal(isLoading);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onRegister = () => {
    const params: RegisterPayload = {
      emailOrPhoneNumber: emailOrPhone,
      username: userName,
      password: password,
      confirmPassword: confirmPassword,
      name: 'string',
      gender: 'male',
      address: 'string',
      phone: 'string',
    };
    handleRegister(params);
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
              value: emailOrPhone,
              onChangeText: setEmailOrPhone,
            }}
          />

          <CommonInput
            label="User Name"
            textInputProp={{
              placeholder: 'Enter name',
              value: userName,
              onChangeText: setUserName,
            }}
          />

          <CommonInputPassword
            label="Enter password"
            textInputProp={{
              value: password,
              onChangeText: setPassword,
            }}
          />

          <CommonInputPassword
            label="Confirm password"
            textInputProp={{
              value: confirmPassword,
              onChangeText: setConfirmPassword,
            }}
          />
        </KeyboardAvoidingView>

        <View style={[styles.rowAround]}>
          <PrimaryButton text="Log in" onPress={goBack} />
          <PrimaryButton text="Next" onPress={onRegister} />
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
});
