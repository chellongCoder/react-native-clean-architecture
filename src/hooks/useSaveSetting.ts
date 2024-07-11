import {useState} from 'react';

export const useSaveSetting = () => {
  const [isLoading, setisLoading] = useState();

  return {
    isLoading,
  };
};
