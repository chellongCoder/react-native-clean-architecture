import {useEffect, useRef, useState} from 'react';
import {useCountDown} from './useCountDown';

export const useTimingQuestion = (isStart: boolean, totalTime?: number) => {
  const {start, stop, time, reset} = useCountDown(totalTime ?? 10);
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
