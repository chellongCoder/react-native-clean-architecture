import 'expo-dev-client';
import {useCallback} from 'react';
import {
  GoogleSignin as GoogleSignIn,
  SignInResponse,
} from '@react-native-google-signin/google-signin';

import env from 'src/core/infrastructure/env';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import Toast from 'react-native-toast-message';
import analytics from '@react-native-firebase/analytics';
import useNavigateAuth from 'src/authentication/presentation/hooks/useNavigateAuthSuccess';
import {ActionE} from 'src/home/application/types/LoggingActionPayload';
import useHomeStore from 'src/home/presentation/stores/useHomeStore';

GoogleSignIn.configure({
  scopes: ['email', 'profile'],
  iosClientId: env?.EXPO_IOS_CLIENT_ID,
  webClientId: env?.WEB_CLIENT_ID,
});

const useGoogleLogin = () => {
  const authenticationStore = useAuthenticationStore();
  const globalLoading = useLoadingGlobal();
  const {selectedChild, loginWithGoogle, setErrorMessage, setIsLoading} =
    authenticationStore;
  const {handleNavigateAuthenticationSuccess} = useNavigateAuth();
  const homeStore = useHomeStore();

  const syncUserGoogleWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilently();
    return user;
  };

  const signOutGoogleAsync = useCallback(async () => {
    await GoogleSignIn.signOut();
    await analytics().logEvent('google_sign_out');
  }, []);

  const handleGoogleSignInResponse = useCallback(
    async (value: SignInResponse) => {
      setIsLoading(true);
      await analytics().logEvent('google_sign_in_response', {
        idToken: value.data?.idToken ? 'present' : 'absent',
      });

      homeStore.putLoggingAction({
        action: ActionE.VIEW_DATA,
        key: 'google',
        userId: selectedChild?.parentId,
        value: {
          idToken: value,
          iosClientId: env?.EXPO_IOS_CLIENT_ID,
          webClientId: env?.WEB_CLIENT_ID,
        },
      });

      if (value.data?.idToken) {
        loginWithGoogle({
          idToken: value.data?.idToken,
        })
          .then(() => {
            handleNavigateAuthenticationSuccess();
          })
          .catch(async error => {
            setIsLoading(false);
            await analytics().logEvent('google_sign_in_error', {
              error: error.message,
            });
          })
          .finally(async () => {
            globalLoading.toggleLoading(false, 'google');
            await analytics().logEvent('google_sign_in_finally');
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginWithGoogle, setErrorMessage, setIsLoading],
  );

  const handleLoginViaGoogle = useCallback(async () => {
    try {
      globalLoading.toggleLoading(true, 'google');
      await analytics().logEvent('google_login_start');

      const check = await GoogleSignIn.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      if (!check) {
        await analytics().logEvent('google_play_services_unavailable');
        return;
      }

      await signOutGoogleAsync();
    } catch (error) {
      await analytics().logEvent('google_login_error', {
        error: (error as any)?.message,
      });
    }

    GoogleSignIn.signIn()
      .then(handleGoogleSignInResponse)
      .catch(async e => {
        Toast.show({
          type: 'error', // or 'error', 'info'
          text1: 'Something has trouble! try again later!',
          text2: JSON.stringify(e),
        });
        setIsLoading(false);
        await analytics().logEvent('google_sign_in_catch', {
          error: e.message,
        });
      })
      .finally(async () => {
        globalLoading.toggleLoading(false, 'google');
        await analytics().logEvent('google_sign_in_finally');
      });
  }, [
    globalLoading,
    handleGoogleSignInResponse,
    setIsLoading,
    signOutGoogleAsync,
  ]);

  return {
    handleLoginViaGoogle,
    syncUserGoogleWithStateAsync,
    signOutGoogleAsync,
  };
};

export default useGoogleLogin;
