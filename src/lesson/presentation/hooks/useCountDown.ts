import {useState} from 'react';

export const useCountDown = (countDownTime: number) => {
  const [time, setTime] = useState(countDownTime);

  const start = () => {
    const interval = setInterval(() => {
      setTime(prev => (prev < 0 ? 0 : prev - 1));
    }, 1000);
    return interval;
  };

  const stop = (interval: NodeJS.Timeout) => {
    clearInterval(interval);
  };

  const reset = () => {
    setTime(countDownTime);
  };

  return {time, start, stop, reset, setTime};
};
