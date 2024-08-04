import {useEffect, useRef, useState} from 'react';
import {getStateBlocking} from 'react-native-alphadex-screentime';
import {useAsyncEffect} from 'src/core/presentation/hooks';

export const useBlockState = () => {
  const blockedRef = useRef<boolean | undefined>();
  const [blocked, setBlocked] = useState<boolean | undefined>();

  useAsyncEffect(async () => {
    try {
      blockedRef.current = await getStateBlocking();

      setBlocked(blockedRef.current);
    } catch (error) {
    } finally {
      blockedRef.current = false;
      setBlocked(false);
    }
  }, []);

  return {
    blocked,
    setBlocked,
  };
};
