import {useCallback, useState} from 'react';

import {LoginUsernamePasswordPayload} from 'src/authentication/application/types/LoginPayload';
import {AxiosError, isAxiosError} from 'axios';
import {Keyboard} from 'react-native';
import useNavigateAuth from './useNavigateAuthSuccess';
import {CustomErrorType, StatusCode} from '../types/StatusCode';
import {Messages} from '../constants/message';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';
import {
  pushScreen,
  replaceScreen,
  resetNavigator,
} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import Toast from 'react-native-toast-message';
import {RegisterChildPayload} from 'src/authentication/application/types/RegisterChildPayload';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import * as Keychain from 'react-native-keychain';
import {ComparePasswordPayload} from 'src/authentication/application/types/ComparePasswordPayload';
import {ChangeParentNamePayload} from 'src/authentication/application/types/ChangeParentNamePayload';
import {ChangeChildDescriptionPayload} from 'src/authentication/application/types/ChangeChildDescriptionPayload';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {LoginMethods} from '../constants/common';

const DefaultFormData = {email: '', password: ''};

const useLoginWithCredentials = () => {
  const {
    loginUsernamePassword,
    setErrorMessage,
    setIsLoading,
    register,
    registerChild,
    getListAllSubject,
    getUserProfile,
    removeCurrentCredentials,
    comparePassword,
    changeParentName,
    changeChildrenDescription,
    getRefreshToken,
    token,
    loginMethod,
    refreshToken,
  } = useAuthenticationStore();
  const {
    handleNavigateAuthenticationSuccess,
    handleNavigateAuthenticationFail,
  } = useNavigateAuth();
  const globalLoading = useLoadingGlobal();

  const [formData, setFormData] =
    useState<LoginUsernamePasswordPayload>(DefaultFormData);

  const setUsername = useCallback(
    (value: string) => {
      setErrorMessage('');
      setFormData({...formData, email: value});
    },
    [formData, setErrorMessage],
  );

  const setPassword = useCallback(
    (value: string) => {
      setErrorMessage('');
      setFormData({...formData, password: value});
    },
    [formData, setErrorMessage],
  );

  const resetForm = useCallback(() => {
    setFormData(DefaultFormData);
  }, []);

  const handleErrorLoginCredentials = useCallback(
    (error: AxiosError) => {
      const {response} = error;
      if (!response) {
        setErrorMessage(Messages.LOGIN_USERNAME_PASSWORD);
        return;
      }
      const {message} = response.data as CustomErrorType;
      switch (response.status) {
        case StatusCode.Forbidden: {
          // Yêu cầu nhập mã xác thực.
          setErrorMessage(message);
          return;
        }
        case StatusCode.BadGateway: {
          setErrorMessage(Messages.BAD_GATEWAY);
          return;
        }
        case StatusCode.UnprocessableEntity: {
          replaceScreen(STACK_NAVIGATOR.AUTH.LOGIN_SCREEN);
          return;
        }
        case StatusCode.BadRequest:
        default: {
          setErrorMessage(message);
          return;
        }
      }
    },
    [setErrorMessage],
  );

  const handleErrorRegister = useCallback(
    (error: AxiosError) => {
      const {response} = error;
      if (!response) {
        setErrorMessage('Cannot register');
      }
      const {message} = response?.data as CustomErrorType;
      switch (response?.status) {
        case StatusCode.Forbidden: {
          // Yêu cầu nhập mã xác thực.
          setErrorMessage(message);
          return;
        }
        case StatusCode.BadGateway: {
          setErrorMessage(Messages.BAD_GATEWAY);
          return;
        }
        case StatusCode.BadRequest:
        default: {
          setErrorMessage(message);
          return;
        }
      }
    },
    [setErrorMessage],
  );

  const storeUsernamePasswordInKeychain = useCallback(
    async (props: {email: string; password: string}) => {
      const {email, password} = props;
      try {
        await Keychain.setGenericPassword(email, password);
      } catch (error) {
        console.log('storeUsernamePasswordInKeychain: ', error);
      }
    },
    [],
  );

  const clearUsernamePasswordInKeychain = useCallback(async () => {
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.log('clearUsernamePasswordInKeychain: ', error);
    }
  }, []);

  const handleLoginWithCredentials = useCallback(
    async (props: {email: string; password: string}) => {
      const {email, password} = props;
      try {
        globalLoading.toggleLoading?.(true, 'login');
        Keyboard.dismiss();
        setErrorMessage('');
        const res = await loginUsernamePassword({
          email: email,
          password: password,
        });

        if (res.error) {
          Toast.show({
            type: 'error',
            text1: res.error.message,
          });
          handleNavigateAuthenticationFail();
        } else {
          Toast.show({
            type: 'success',
            text1: res.message,
          });
          await storeUsernamePasswordInKeychain({
            email: email,
            password: password,
          });
          handleNavigateAuthenticationSuccess();
        }
        resetForm();
      } catch (error: any) {
        handleNavigateAuthenticationFail();
        const errorTimeout = (error.message as string).includes('timeout')
          ? 'Lost connection to server. Please try again!'
          : error.message;
        Toast.show({
          type: 'error',
          text1: errorTimeout,
        });
        if (isAxiosError(error)) {
          handleErrorLoginCredentials(error as AxiosError);
        }
      } finally {
        setIsLoading(false);
        globalLoading.toggleLoading?.(false, 'login');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      handleErrorLoginCredentials,
      handleNavigateAuthenticationFail,
      handleNavigateAuthenticationSuccess,
      loginUsernamePassword,
      resetForm,
      setErrorMessage,
      setIsLoading,
      storeUsernamePasswordInKeychain,
    ],
  );

  const getUsernamePasswordInKeychain = useCallback(async () => {
    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();

      if (credentials && credentials.username && credentials.password) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username,
        );
        await handleLoginWithCredentials({
          email: credentials.username,
          password: credentials.password,
        });
        return true;
      } else {
        console.log('No credentials stored');
        if (loginMethod === LoginMethods.Google) {
          handleNavigateAuthenticationSuccess();
          getRefreshToken(refreshToken);
          return;
        }
        replaceScreen(STACK_NAVIGATOR.AUTH.LOGIN_SCREEN);
        return null;
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
      replaceScreen(STACK_NAVIGATOR.AUTH.LOGIN_SCREEN);
      return null;
    }
  }, [
    getRefreshToken,
    handleLoginWithCredentials,
    handleNavigateAuthenticationSuccess,
    loginMethod,
    refreshToken,
  ]);

  const handleRegister = useCallback(
    async (props: RegisterPayload) => {
      const {
        emailOrPhoneNumber,
        username,
        password,
        confirmPassword,
        name,
        gender,
        address,
        phone,
      } = props;
      try {
        globalLoading.toggleLoading(true, 'register');
        const res = await register({
          emailOrPhoneNumber,
          username,
          password,
          confirmPassword,
          name,
          gender,
          address,
          phone,
        });
        if (res.error) {
          Toast.show({
            type: 'error',
            text1: res.error.message,
          });
        } else {
          Toast.show({
            type: 'success',
            text1: res.message,
          });
          await storeUsernamePasswordInKeychain({
            email: emailOrPhoneNumber,
            password: password,
          });
          pushScreen(STACK_NAVIGATOR.AUTH.REGISTER_CHILD_SCREEN, {});
        }
      } catch (error) {
        if (isAxiosError(error)) {
          handleErrorRegister(error as AxiosError);
        }
      } finally {
        setIsLoading(false);
        globalLoading.toggleLoading(false, 'register');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      handleErrorRegister,
      register,
      setIsLoading,
      storeUsernamePasswordInKeychain,
    ],
  );

  const handleRegisterChild = useCallback(
    async (props: RegisterChildPayload) => {
      const {age, name, subjectIds, gender} = props;
      try {
        const res = await registerChild({
          age,
          name,
          subjectIds,
          gender,
        });
        if (res.error) {
          Toast.show({
            type: 'error',
            text1: res.error.message,
          });
        } else {
          Toast.show({
            type: 'success',
            text1: res.message,
          });
          pushScreen(STACK_NAVIGATOR.AUTH.LIST_CHILDREN_SCREEN, {});
        }
      } catch (error) {
        if (isAxiosError(error)) {
          handleErrorRegister(error as AxiosError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [handleErrorRegister, registerChild, setIsLoading],
  );

  const handleGetListAllSubject = useCallback(async () => {
    try {
      const res = await getListAllSubject();
      if (res.error) {
        Toast.show({
          type: 'error',
          text1: res.error.message,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: res.message,
        });
      }
      return res.data;
    } catch (error) {
      if (isAxiosError(error)) {
        handleErrorRegister(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getListAllSubject, handleErrorRegister, setIsLoading]);

  const handleGetUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();
      if (res.error) {
        Toast.show({
          type: 'error',
          text1: res.error.message,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: res.message,
        });
      }
      return res.data;
    } catch (error) {
      if (isAxiosError(error)) {
        handleErrorRegister(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getUserProfile, handleErrorRegister, setIsLoading]);

  const handleLogOut = useCallback(async () => {
    try {
      removeCurrentCredentials();
      clearUsernamePasswordInKeychain();
      resetNavigator(STACK_NAVIGATOR.AUTH_NAVIGATOR, {
        screen: STACK_NAVIGATOR.AUTH.LOGIN_SCREEN,
      });
    } catch (error) {
      console.log('handleLogOutFailed: ', error);
    } finally {
      setIsLoading(false);
    }
  }, [clearUsernamePasswordInKeychain, removeCurrentCredentials, setIsLoading]);

  const handleComparePassword = useCallback(
    async (props: ComparePasswordPayload) => {
      try {
        setIsLoading(true);
        const res = await comparePassword(props);
        if (res.code === 200) {
          return res.code;
        } else {
          return false;
        }
      } catch (error) {
        if (isAxiosError(error)) {
          setErrorMessage('Password not match!');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [comparePassword, setErrorMessage, setIsLoading],
  );

  const handleChangeParentName = useCallback(
    async (props: ChangeParentNamePayload) => {
      try {
        const res = await changeParentName(props);
        if (res.data.code === 200) {
          return res.data;
        } else {
          return false;
        }
      } catch (error) {
        if (isAxiosError(error)) {
          setErrorMessage('Password not match!');
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [changeParentName, setErrorMessage, setIsLoading],
  );

  const handleChangeChildDescription = useCallback(
    async (props: ChangeChildDescriptionPayload) => {
      try {
        const res = await changeChildrenDescription(props);
        if (res.message === 'Update children success') {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        if (isAxiosError(error)) {
          setErrorMessage('Password not match!');
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [changeChildrenDescription, setErrorMessage, setIsLoading],
  );

  return {
    formData,
    setUsername,
    setPassword,
    handleLoginWithCredentials,
    handleErrorLoginCredentials,
    handleRegister,
    handleErrorRegister,
    handleRegisterChild,
    handleGetListAllSubject,
    handleGetUserProfile,
    getUsernamePasswordInKeychain,
    clearUsernamePasswordInKeychain,
    handleLogOut,
    handleComparePassword,
    handleChangeParentName,
    handleChangeChildDescription,
  };
};
export default useLoginWithCredentials;
