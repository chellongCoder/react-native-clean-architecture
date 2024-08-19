import {useEffect, useRef, useState} from 'react';
import {useCountDown} from './useCountDown';

export const useTimingQuestion = (isStart: boolean) => {
  const {start, stop, time, reset} = useCountDown(10);
  const intervalRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (isStart) {
      intervalRef.current = start();
      return () => {
        stop(intervalRef.current!);
      };
    }
  }, [isStart, start, stop]);

  useEffect(() => {
    if (time === 0) {
      stop(intervalRef.current!);
    }
  }, [stop, time]);

  return {time, reset};
};
