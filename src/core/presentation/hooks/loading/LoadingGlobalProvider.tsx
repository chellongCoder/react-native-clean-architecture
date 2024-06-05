import React, {PropsWithChildren, useCallback, useState} from 'react';
import {LoadingGlobalContext} from './LoadingGlobalContext';
import LoadingGlobal from '../../components/LoadingGlobal';

export const LoadingGlobalProvider = ({children}: PropsWithChildren) => {
  const [shown, setShown] = useState(false);
  const show = useCallback(() => {
    setShown(true);
  }, []);

  const hide = useCallback(() => {
    setShown(false);
  }, []);

  return (
    <LoadingGlobalContext.Provider
      value={{
        show,
        hide,
        isShown: shown,
      }}>
      {children}
      {shown ? <LoadingGlobal /> : null}
    </LoadingGlobalContext.Provider>
  );
};
