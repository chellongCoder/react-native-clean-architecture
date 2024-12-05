import 'expo-dev-client';
import {useCallback} from 'react';
import {
  GoogleSignin as GoogleSignIn,
  SignInResponse,
} from '@react-native-google-signin/google-signin';

import env from 'src/core/infrastructure/env';
console.log('🛠 LOG: 🚀 --> --------------------------🛠 LOG: 🚀 -->');
console.log('🛠 LOG: 🚀 --> ~ env:', env);
console.log('🛠 LOG: 🚀 --> --------------------------🛠 LOG: 🚀 -->');

import {SocialName} from 'src/authentication/application/types/LoginPayload';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import Toast from 'react-native-toast-message';

GoogleSignIn.configure({
  scopes: ['email', 'profile'],
  iosClientId: env?.EXPO_IOS_CLIENT_ID,
  webClientId: env?.WEB_CLIENT_ID,
});

const useGoogleLogin = () => {
  const authenticationStore = useAuthenticationStore();
  const globalLoading = useLoadingGlobal();
  const {loginWithGoogle, setErrorMessage, setIsLoading} = authenticationStore;

  const syncUserGoogleWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilently();
    return user;
  };

  const signOutGoogleAsync = useCallback(async () => {
    await GoogleSignIn.signOut();
  }, []);

  const handleGoogleSignInResponse = useCallback(
    (value: SignInResponse) => {
      console.log(
        '🛠 LOG: 🚀 --> -----------------------------------------------🛠 LOG: 🚀 -->',
      );
      console.log('🛠 LOG: 🚀 --> ~ useGoogleLogin ~ value:', value);
      console.log(
        '🛠 LOG: 🚀 --> -----------------------------------------------🛠 LOG: 🚀 -->',
      );
      setIsLoading(true);
      if (value.data?.idToken) {
        loginWithGoogle({
          idToken: value.data?.idToken,
        })
          .catch(error => {
            setIsLoading(false);
          })
          .finally(() => {
            globalLoading.toggleLoading(false, 'google');
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginWithGoogle, setErrorMessage, setIsLoading],
  );

  const handleLoginViaGoogle = useCallback(async () => {
    try {
      globalLoading.toggleLoading(true, 'google');
      const check = await GoogleSignIn.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      if (!check) {
        return;
      }

      await signOutGoogleAsync();
    } catch (error) {
      //
    }

    GoogleSignIn.signIn()
      .then(handleGoogleSignInResponse)
      .catch(e => {
        Toast.show({
          type: 'error', // or 'error', 'info'
          text1: 'Something has trouble! try again later!',
          text2: JSON.stringify(e),
        });
        setIsLoading(false);
      })
      .finally(() => {
        globalLoading.toggleLoading(false, 'google');
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
