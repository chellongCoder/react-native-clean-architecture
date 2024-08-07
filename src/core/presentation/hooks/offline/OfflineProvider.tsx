import React, {PropsWithChildren, useEffect} from 'react';
import {OfflineContext} from './OfflineContext';
import {fetch} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStateCustom from 'src/hooks/useStateCommon';

type TOfflineState = {
  offlineMode: boolean | null;
};

export const OfflineProvider = ({children}: PropsWithChildren) => {
  const [offlineState, setOfflineState] = useStateCustom<TOfflineState>({
    offlineMode: null,
  });

  const storeData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('storeDataFailed: ', key);
    }
  };

  const getData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log('jsonValue: ', jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('getDataFailed: ', key);
    }
  };

  const removeValue = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log('RemoveValue Failed: ', key);
    }

    console.log('RemoveValue Done: ', key);
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log('ClearAll Failed.');
    }

    console.log('ClearAll Done.');
  };

  useEffect(() => {
    fetch().then(state => {
      setOfflineState({offlineMode: state.isConnected});
    });
  }, [setOfflineState]);

  return (
    <OfflineContext.Provider
      value={{
        isConnected: offlineState.offlineMode,
        storeData,
        getData,
        removeValue,
        clearAll,
      }}>
      {children}
    </OfflineContext.Provider>
  );
};
