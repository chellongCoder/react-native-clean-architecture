import React, {Fragment, useMemo, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import ListSubject from '../components/subjects/ListSubject';
import AccountStatus from '../components/AccountStatus';
import {scale} from 'react-native-size-matters';
import {observer} from 'mobx-react';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {HomeProvider} from '../stores/HomeProvider';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WIDTH_SCREEN} from 'src/core/presentation/utils';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {COLORS} from 'src/core/presentation/constants/colors';
import {assets} from 'src/core/presentation/utils';
import ErrorBoundary from 'src/core/presentation/components/ErrorBoundary';
import PrimaryButton from 'src/lesson/presentation/components/PrimaryButton';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

/**
 * Fallback UI component shown when HomeScreen crashes
 */
const HomeScreenFallback = ({onRetry}: {onRetry?: () => void}) => {
  const inset = useSafeAreaInsets();
  const globalStyle = useGlobalStyle();

  return (
    <Fragment>
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{alignItems: 'flex-start'}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.imageWrapper}>
            {/* Fallback background image */}
            <FastImage
              source={assets.bee_bg}
              style={[
                styles.image,
                {height: WIDTH_SCREEN * 3.35, width: '100%', opacity: 0.5},
              ]}
              resizeMode="contain"
            />
          </View>

          <View
            style={[[styles.wrapContentContainer, {paddingTop: inset.top}]]}>
            <View
              style={{
                position: 'absolute',
                right: scale(10),
                zIndex: 999,
                top: inset.top,
              }}>
              <AccountStatus />
            </View>
            <View style={styles.fallbackContainer}>
              <Text style={[globalStyle.txtLabel, styles.fallbackTitle]}>
                Oops! Something went wrong
              </Text>
              <Text style={[globalStyle.txtNote, styles.fallbackMessage]}>
                We're sorry, but we encountered an issue loading the home
                screen. Please try again.
              </Text>
              {onRetry && (
                <PrimaryButton
                  text="Try Again"
                  style={[styles.fallbackButton]}
                  onPress={onRetry}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Fragment>
  );
};

const HomeScreenContent = observer(() => {
  const inset = useSafeAreaInsets();
  const env = coreModuleContainer.getProvided<Env>(EnvToken);
  const lastProgressRef = useRef(0);

  // Loading states
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const remoteImageUri = useMemo(
    () => env.IMAGE_BACKGROUND_BASE_API_URL + 'bg-HOME.png',
    [env.IMAGE_BACKGROUND_BASE_API_URL],
  );

  const remoteImageSource = useMemo(
    () => ({
      uri: remoteImageUri,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable,
    }),
    [remoteImageUri],
  );

  return (
    <Fragment>
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{alignItems: 'flex-start'}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.imageWrapper}>
            {(isImageLoading || imageLoadError) && (
              <FastImage
                source={assets.bee_bg}
                style={[
                  styles.image,
                  {height: WIDTH_SCREEN * 3.35, width: '100%'},
                ]}
                resizeMode="contain"
              />
            )}

            {!imageLoadError && isImageLoading && (
              <FastImage
                source={remoteImageSource}
                style={[
                  styles.image,
                  styles.preloadImage,
                  {height: WIDTH_SCREEN * 3.35, width: '100%'},
                ]}
                resizeMode="contain"
                onLoadStart={() => {
                  lastProgressRef.current = 0;
                  setIsImageLoading(true);
                  setImageLoadError(false);
                  setLoadingProgress(0);
                }}
                onProgress={e => {
                  if (!e.nativeEvent.total) {
                    return;
                  }

                  const nextProgress = Math.min(
                    100,
                    Math.round(
                      (e.nativeEvent.loaded / e.nativeEvent.total) * 100,
                    ),
                  );

                  if (nextProgress === lastProgressRef.current) {
                    return;
                  }

                  lastProgressRef.current = nextProgress;
                  setLoadingProgress(nextProgress);
                }}
                onLoad={() => {
                  lastProgressRef.current = 100;
                  setLoadingProgress(100);
                  setIsImageLoading(false);
                }}
                onLoadEnd={() => {
                  lastProgressRef.current = 100;
                  setLoadingProgress(100);
                  setIsImageLoading(false);
                }}
                onError={() => {
                  setIsImageLoading(false);
                  setImageLoadError(true);
                  setLoadingProgress(0);
                }}
                fallback={false}
              />
            )}

            {!imageLoadError && !isImageLoading && (
              <FastImage
                source={remoteImageSource}
                style={[
                  styles.image,
                  {height: WIDTH_SCREEN * 3.35, width: '100%'},
                ]}
                resizeMode="contain"
                fallback={false}
              />
            )}

            {/* Loading overlay */}
            {isImageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS.GREEN_66C270} />
                {loadingProgress > 0 && (
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {width: `${loadingProgress}%`},
                      ]}
                    />
                  </View>
                )}
              </View>
            )}
          </View>

          <View
            style={[[styles.wrapContentContainer, {paddingTop: inset.top}]]}>
            <View
              style={{
                position: 'absolute',
                right: scale(10),
                zIndex: 999,
                top: inset.top,
              }}>
              <AccountStatus />
            </View>
            <ListSubject />
          </View>
        </ScrollView>
      </View>
    </Fragment>
  );
});

const HomeScreen = () => {
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <ErrorBoundary
      resetKey={retryKey}
      fallback={<HomeScreenFallback onRetry={handleRetry} />}>
      <HomeScreenContent />
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapContentContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
  },
  preloadImage: {
    position: 'absolute',
    opacity: 0,
    zIndex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 248, 204, 0.8)', // Using your app's background color with transparency
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  progressContainer: {
    width: scale(200),
    height: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(2),
    marginTop: scale(16),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.GREEN_66C270,
    borderRadius: scale(2),
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    minHeight: 400,
    marginTop: scale(100),
  },
  fallbackTitle: {
    fontSize: 18,
    color: COLORS.BLUE_1C6349,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fallbackMessage: {
    fontSize: 12,
    color: COLORS.BLUE_1C6349,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: scale(20),
  },
  fallbackButton: {
    width: scale(120),
    marginTop: scale(16),
  },
});

export default withProviders(HomeProvider)(HomeScreen);
