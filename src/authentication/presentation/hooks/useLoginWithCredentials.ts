import {useCallback, useState} from 'react';

import {LoginUsernamePasswordPayload} from 'src/authentication/application/types/LoginPayload';
import {AxiosError, isAxiosError} from 'axios';
import {Keyboard} from 'react-native';
import useNavigateAuthSuccess from './useNavigateAuthSuccess';
import {CustomErrorType, StatusCode} from '../types/StatusCode';
import {Messages} from '../constants/message';
import useAuthenticationStore from '../stores/useAuthenticationStore';

const DefaultFormData = {email: '', password: ''};

const useLoginWithCredentials = () => {
  const {loginUsernamePassword, setErrorMessage, setIsLoading} =
    useAuthenticationStore();
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

  const handleLoginWithCredentials = useCallback(
    async (props: {email: string; password: string}) => {
      const {email, password} = props;
      try {
        Keyboard.dismiss();
        setErrorMessage('');
        await loginUsernamePassword({
          email: 'doannv@gmail.com',
          password: 'doannv',
        });
        resetForm();
        handleNavigateAuthenticationSuccess();
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

  return {
    formData,
    setUsername,
    setPassword,
    handleLoginWithCredentials,
    handleErrorLoginCredentials,
  };
};
export default useLoginWithCredentials;
