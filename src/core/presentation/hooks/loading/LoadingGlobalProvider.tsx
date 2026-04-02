import React, {PropsWithChildren, useCallback, useRef, useState, useEffect} from 'react';
import {LoadingGlobalContext} from './LoadingGlobalContext';
import LoadingGlobal from '../../components/LoadingGlobal';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import useGlobalStyle from '../useGlobalStyle';

export const LoadingGlobalProvider = ({children}: PropsWithChildren) => {
  const [shown, setShown] = useState(false);
  const [status, setStatus] = useState(false);

  const nameSpaceRef = useRef<string | undefined>('');
  const opacity = useSharedValue(0);
  const styleGlobal = useGlobalStyle();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback(() => {
    setShown(true);
  }, []);

  const hide = useCallback(() => {
    setShown(false);
  }, []);

  const toggleLoading = useCallback(
    (bool: boolean, nameSpace?: string) => {
      opacity.value = bool ? 1 : 0;

      // Clear any pending timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(
        () => {
          setStatus((prevState: boolean) => {
            if (!prevState) {
              nameSpaceRef.current = nameSpace;
              return bool;
            } else {
              if (nameSpaceRef.current === nameSpace) {
                return bool;
              }
            }
            return prevState;
          });
        },
        bool ? 0 : 1100,
      );
    },
    [opacity],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(
        0,
        withTiming(opacity.value, {
          duration: 500,
        }),
      ),
    };
  });

  return (
    <LoadingGlobalContext.Provider
      value={{
        show,
        hide,
        toggleLoading,
        isShown: status,
      }}>
      {children}
      {status ? (
        <Animated.View style={[styleGlobal.positionAbsolute, animatedStyle]}>
          <LoadingGlobal />
        </Animated.View>
      ) : null}
      {/* {shown ? <LoadingGlobal /> : null} */}
    </LoadingGlobalContext.Provider>
  );
};
