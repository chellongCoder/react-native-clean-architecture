import {useCallback, useState} from 'react';

export const useCountDown = (countDownTime: number) => {
  const [time, setTime] = useState(countDownTime);

  const start = useCallback(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev < 0 ? 0 : prev - 1));
    }, 1000);
    return interval;
  }, [countDownTime]);

  const stop = useCallback((interval: NodeJS.Timeout) => {
    clearInterval(interval);
  }, [countDownTime]);

  const reset = useCallback(() => {
    setTime(countDownTime);
  }, [countDownTime]);

  return {time, start, stop, reset, setTime};
};
