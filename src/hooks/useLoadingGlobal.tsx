import {useContext} from 'react';

const useLoadingGlobal = () => {
  return useContext(LoadingGlobalContext);
};

export default useLoadingGlobal;

import React, {useCallback, useMemo, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Loading from './Components/Loading';
// import useTheme from './useThemeDefault';

export type LoadingGlobalT = {
  status?: boolean;
  toggleLoading?: (bool: boolean, nameSpace?: string) => void;
};

export const LoadingGlobalContext = React.createContext<LoadingGlobalT>({});

export const LoadingGlobalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState(false);

  const nameSpaceRef = useRef<string | undefined>('');
  const opacity = useSharedValue(0);

  const toggleLoading = useCallback(
    (bool: boolean, nameSpace?: string) => {
      opacity.value = bool ? 1 : 0;

      setTimeout(
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(
        0,
        withTiming(opacity.value, {
          duration: 1000,
        }),
      ),
    };
  });

  const contextValue = useMemo<LoadingGlobalT>(
    () => ({
      status,
      toggleLoading,
    }),
    [status, toggleLoading],
  );

  return (
    <LoadingGlobalContext.Provider value={contextValue}>
      {children}
      {status ? (
        <Animated.View
          style={[
            Common.positionAbsolute,
            animatedStyle,
            {
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            },
          ]}>
          <Loading />
        </Animated.View>
      ) : null}
    </LoadingGlobalContext.Provider>
  );
};
