import React, {PropsWithChildren, useEffect} from 'react';
import {GoogleAdsmobContext} from './GoogleAdsmobContext';
import {useGGAdsMob} from 'src/hooks/useGGAdsMob';

type GoogleAdsmobState = any;

export const GoogleAdsmobProvider = ({
  children,
}: PropsWithChildren & GoogleAdsmobState) => {
  const ggAdsValue = useGGAdsMob();
  return (
    <GoogleAdsmobContext.Provider value={ggAdsValue}>
      {children}
    </GoogleAdsmobContext.Provider>
  );
};
