import {useEffect, useState} from 'react';
import {authenticationModuleContainer} from 'src/authentication/AuthenticationModule';
import {AuthenticationStore} from 'src/authentication/presentation/stores/AuthenticationStore';
import {coreModuleContainer} from 'src/core/CoreModule';
import HttpClient from 'src/core/infrastructure/implementations/HttpClient';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'mobx-persist';
import {homeModuleContainer} from 'src/home/HomeModule';
import {HomeStore} from 'src/home/presentation/stores/HomeStore';

const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrate = create({
    storage: AsyncStorage, // or AsyncStorage in react-native.
    // default: localStorage
    jsonify: true, // if you use AsyncStorage, here shoud be true
    // default: true
  });

  const hydrateStores = () => {
    const stores = getStoresToHydrate();
    return Promise.all(stores.map(({key, store}) => hydrate(key, store)));
  };

  const getStoresToHydrate = () => [
    {
      key: 'homeStore',
      store: homeModuleContainer.getProvided(HomeStore),
    },
    {
      key: 'authStore',
      store: authenticationModuleContainer.getProvided(AuthenticationStore),
    },
  ];

  const setupHttpClient = () => {
    const {token} =
      authenticationModuleContainer.getProvided(AuthenticationStore);
    if (token) {
      const env = coreModuleContainer.getProvided<Env>(EnvToken);
      const client = new HttpClient(env);
      client.setAuthCredentials({token});
    }
  };

  useEffect(() => {
    const hydrateAllStores = async () => {
      await hydrateStores();
      setupHttpClient();
      setIsHydrated(true);
    };

    hydrateAllStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isHydrated;
};

export default useHydration;
