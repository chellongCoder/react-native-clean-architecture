import React, {PropsWithChildren, useEffect} from 'react';

import {homeModuleContainer} from 'src/home/HomeModule';
import {HomeContext} from './HomeContext';
import {HomeStore} from './HomeStore';
import useHomeStore from './useHomeStore';
import useStateCustom from 'src/hooks/useStateCommon';
import {FieldData} from 'src/home/application/types/GetFieldResponse';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {IMergedData} from '../components/ListSubject';
import {Subject} from 'src/home/application/types/GetListSubjectResponse';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';

export interface IHomeState {
  listField?: FieldData[];
  field?: IMergedData;
  listSubject?: Subject[];
}

export const HomeProvider = ({children}: PropsWithChildren) => {
  const store = homeModuleContainer.getProvided(HomeStore);
  const {isLoading, getField, getListSubject} = useHomeStore();
  useLoadingGlobal(isLoading);

  const [homeState, setHomeState] = useStateCustom<IHomeState>({
    listField: [],
    field: undefined,
    listSubject: undefined,
  });

  const onSelectField = (e: IMergedData) => {
    setHomeState({field: e});
  };

  useEffect(() => {
    async function fetchListSubject() {
      if (homeState?.field) {
        const res = await getListSubject({fieldId: homeState?.field._id});
        if (res.data) {
          setHomeState({listSubject: res.data});
          navigateScreen(STACK_NAVIGATOR.HOME.SUBJECT_SCREEN);
        }
      }
    }
    fetchListSubject();
  }, [getField, getListSubject, homeState?.field, setHomeState]);

  useEffect(() => {
    async function fetchField() {
      const res = await getField();
      if (res.data) {
        setHomeState({listField: res.data});
      }
    }
    fetchField();
  }, [getField, setHomeState]);

  return (
    <HomeContext.Provider
      value={{
        homeStore: store,
        homeState: homeState,
        onSelectField: onSelectField,
      }}>
      {children}
    </HomeContext.Provider>
  );
};
