import React, {PropsWithChildren, useCallback, useEffect} from 'react';

import {homeModuleContainer} from 'src/home/HomeModule';
import {HomeContext} from './HomeContext';
import {HomeStore} from './HomeStore';
import useHomeStore from './useHomeStore';
import useStateCustom from 'src/hooks/useStateCommon';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {IMergedData} from '../components/subjects/ListSubject';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {useOfflineMode} from 'src/core/presentation/hooks/offline/useOfflineMode';
import {OfflineEnum} from 'src/core/presentation/hooks/offline/OfflineEnum';

export interface IHomeState {
  listField?: FieldData[];
  field?: IMergedData;
  listSubject?: Subject[];
}

export const HomeProvider = ({children}: PropsWithChildren) => {
  const store = homeModuleContainer.getProvided(HomeStore);
  const {getField, getListSubject} = useHomeStore();
  const {storeData, getData, isConnected} = useOfflineMode();
  useLoadingGlobal();

  const [homeState, setHomeState] = useStateCustom<IHomeState>({
    listField: [],
    field: undefined,
    listSubject: undefined,
  });

  const onSelectField = (e?: IMergedData) => {
    setHomeState({field: e});
  };

  const fetchListSubject = useCallback(
    async (field?: IHomeState['field']) => {
      if (field) {
        const res = await getListSubject({fieldId: field?._id});
        storeData(OfflineEnum.LIST_SUBJECT, res.data);
        if (res.data) {
          setHomeState({listSubject: res.data});
        }
      }
    },
    [getListSubject, setHomeState, storeData],
  );

  useEffect(() => {
    async function _getListSubject() {
      if (homeState?.field) {
        const res = await getListSubject({fieldId: homeState?.field._id});
        storeData(OfflineEnum.LIST_SUBJECT, res.data);
        if (res.data) {
          setHomeState({listSubject: res.data});
          navigateScreen(STACK_NAVIGATOR.HOME.SUBJECT_SCREEN, {});
        }
      }
    }
    _getListSubject();
  }, [getListSubject, homeState?.field, setHomeState, storeData]);

  useEffect(() => {
    async function fetchField() {
      const res = await getField();
      storeData(OfflineEnum.LIST_FIELD, res.data);
      if (res.data) {
        setHomeState({listField: res.data});
      }
    }
    fetchField();
  }, [getField, setHomeState, storeData]);

  useEffect(() => {
    const getDataFromStore = async () => {
      if (!isConnected) {
        const res = await getData(OfflineEnum.LIST_FIELD);
        setHomeState({listField: res});
      }
    };

    getDataFromStore();
  }, [getData, isConnected, setHomeState]);

  // useEffect(() => {
  //   if (!isConnected) {
  //     navigateScreen(STACK_NAVIGATOR.HOME.SUBJECT_SCREEN, {});
  //   }
  // }, [homeState.field, isConnected]);

  return (
    <HomeContext.Provider
      value={{
        homeStore: store,
        homeState: homeState,
        onSelectField: onSelectField,
        fetchListSubject,
      }}>
      {children}
    </HomeContext.Provider>
  );
};
