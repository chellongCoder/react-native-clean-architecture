import {useCallback, useEffect, useMemo, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

export const useAuthParent = () => {
  const [isShowAuth, setIsShowAuth] = useState(false);
  useFocusEffect(
    useCallback(() => {
      console.log('ParentScreen is focused');
      setIsShowAuth(true);
      return () => {
        console.log('ParentScreen is unfocused');
        setIsShowAuth(false);
      };
    }, []),
  );
  const changeIsShowAuth = useCallback(() => {
    setIsShowAuth(v => !v);
  }, []);
  return {
    isShowAuth,
    changeIsShowAuth,
  };
};
