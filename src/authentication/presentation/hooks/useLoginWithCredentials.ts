import {useCallback, useState} from 'react';

import {LoginUsernamePasswordPayload} from 'src/authentication/application/types/LoginPayload';
import {AxiosError, isAxiosError} from 'axios';
import {Keyboard} from 'react-native';
import useNavigateAuthSuccess from './useNavigateAuthSuccess';
import {CustomErrorType, StatusCode} from '../types/StatusCode';
import {Messages} from '../constants/message';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {RegisterPayload} from 'src/authentication/application/types/RegisterPayload';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import Toast from 'react-native-toast-message';
import {RegisterChildPayload} from 'src/authentication/application/types/RegisterChildPayload';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';

const DefaultFormData = {email: '', password: ''};

const useLoginWithCredentials = () => {
  const {
    loginUsernamePassword,
    setErrorMessage,
    setIsLoading,
    register,
    registerChild,
    getListAllSubject,
  } = useAuthenticationStore();
  const {handleNavigateAuthenticationSuccess} = useNavigateAuthSuccess();

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

  const handleLoginWithCredentials = useCallback(
    async (props: {email: string; password: string}) => {
      const {email, password} = props;
      try {
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
        } else {
          Toast.show({
            type: 'success',
            text1: res.message,
          });
          handleNavigateAuthenticationSuccess();
        }
        resetForm();
      } catch (error) {
        if (isAxiosError(error)) {
          handleErrorLoginCredentials(error as AxiosError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      handleErrorLoginCredentials,
      handleNavigateAuthenticationSuccess,
      loginUsernamePassword,
      resetForm,
      setErrorMessage,
      setIsLoading,
    ],
  );

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
          navigateScreen(STACK_NAVIGATOR.AUTH.REGISTER_CHILD_SCREEN);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          handleErrorRegister(error as AxiosError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [handleErrorRegister, register, setIsLoading],
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
          navigateScreen(STACK_NAVIGATOR.AUTH.LIST_CHILDREN_SCREEN);
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
  };
};
export default useLoginWithCredentials;
