import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {firebase} from '@react-native-firebase/analytics';

interface PerformanceMetrics {
  fps: number;
  droppedFrames: number;
  jsThreadBlocked: boolean;
  timestamp: number;
}

const THROTTLE_INTERVAL = 5000; // 5 seconds
const LOW_FPS_THRESHOLD = 30;
const JS_BLOCK_THRESHOLD = 1000; // 1 second without callback = JS blocked

export const useJSLoopDetection = (screenName?: string) => {
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  const lastCallbackTime = useRef(Date.now());
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Track app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground - reset counters
        frameCount.current = 0;
        lastTime.current = Date.now();
        lastCallbackTime.current = Date.now();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Create a recurring callback that should be called frequently
    // If JS thread is blocked, this callback will be delayed
    const checkPerformance = () => {
      const now = Date.now();
      const elapsed = now - lastTime.current;

      // Calculate FPS based on frame count
      const fps =
        elapsed > 0 ? Math.round((frameCount.current / elapsed) * 1000) : 60;

      // Check if JS thread is blocked (callback delayed beyond threshold)
      const timeSinceLastCallback = now - lastCallbackTime.current;
      const jsThreadBlocked = timeSinceLastCallback > JS_BLOCK_THRESHOLD;

      // Log performance metrics every interval
      if (elapsed >= THROTTLE_INTERVAL) {
        const metrics: PerformanceMetrics = {
          fps,
          droppedFrames: Math.max(0, 60 - fps), // Approximate dropped frames
          jsThreadBlocked,
          timestamp: now,
        };

        // Log to Firebase Analytics
        firebase.analytics().logEvent('performance_metrics', {
          screen_name: screenName || 'unknown',
          fps: metrics.fps,
          dropped_frames: metrics.droppedFrames,
          js_thread_blocked: metrics.jsThreadBlocked,
          elapsed_ms: elapsed,
          app_state: appState.current,
        });

        // Alert on low FPS
        if (fps < LOW_FPS_THRESHOLD) {
          firebase.analytics().logEvent('low_fps_alert', {
            screen_name: screenName || 'unknown',
            fps: metrics.fps,
            dropped_frames: metrics.droppedFrames,
            js_thread_blocked: jsThreadBlocked,
          });
        }

        // Alert on JS thread blocked
        if (jsThreadBlocked) {
          firebase.analytics().logEvent('js_thread_blocked', {
            screen_name: screenName || 'unknown',
            blocked_duration_ms: timeSinceLastCallback,
          });
        }

        // Reset counters
        frameCount.current = 0;
        lastTime.current = now;
      }

      lastCallbackTime.current = now;
      frameCount.current++;
    };

    // Run the performance check frequently
    const intervalId = setInterval(checkPerformance, 100);

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [screenName]);
};

export default useJSLoopDetection;
