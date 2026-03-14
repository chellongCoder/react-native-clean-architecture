import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ActivityIndicator, Text, View, StyleSheet} from 'react-native';
import CodePush, {DownloadProgress, LocalPackage} from 'react-native-code-push';
import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';
import {useI18n} from './useI18n';
import {lessonModuleContainer} from 'src/lesson/LessonModule';
import {LessonStore} from 'src/lesson/presentation/stores/LessonStore/LessonStore';
import {observer} from 'mobx-react';

export type CodePushContextValue = {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  metaData: LocalPackage | null;
};

const CodePushContext = React.createContext<Partial<CodePushContextValue>>({});

export const useCodePush = () => useContext(CodePushContext);

type Props = {children: React.ReactNode};

const CodePushProvider: React.FC<Props> = observer(({children}) => {
  const env = coreModuleContainer.getProvided<Env>(EnvToken);
  const value = lessonModuleContainer.getProvided(LessonStore);

  const {isOverlay, isPushNoti, isUsageStats} = value;

  const isConfirm = useMemo(
    () => isOverlay && isPushNoti && isUsageStats,
    [isOverlay, isPushNoti, isUsageStats],
  );

  const [progress, setProgress] = useState<number>(-1);
  const [statusUpdate, setStatusUpdate] = useState<string>('');
  console.log('🛠 LOG: 🚀 --> ~ CodePushProvider ~ statusUpdate:', statusUpdate);

  const [metaData, setMetaData] = useState<LocalPackage | null>(null);
  const i18n = useI18n();

  const codePushStatusDidChange = (status: CodePush.SyncStatus) => {
    switch (status) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setProgress(0);
        setStatusUpdate(
          i18n.t('core.screens.codepush.checkingForUpdate') + '...',
        );
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setStatusUpdate(
          i18n.t('core.screens.codepush.downloadingUpdate') + '...',
        );
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setStatusUpdate(
          i18n.t('core.screens.codepush.installingUpdate') + '...',
        );
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        setStatusUpdate(i18n.t('core.screens.codepush.upToDate'));
        setProgress(-1);
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setStatusUpdate(i18n.t('core.screens.codepush.updateInstalled'));
        setProgress(-1);
        break;
      default:
        setProgress(-1);
        break;
    }
  };

  const downloadProgressCallback = useCallback((p: DownloadProgress) => {
    const ratio = Math.round((p.receivedBytes / p.totalBytes) * 100);
    setProgress(curr => (curr !== ratio ? ratio : curr));
  }, []);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        console.log(
          '🔍 Checking for updates with deployment key:',
          env.CODEPUSH_DEPLOYMENT_KEY,
        );
        // Check current app version info
        const currentPackage = await CodePush.getUpdateMetadata();
        console.log('📦 Current package (any state):', currentPackage);

        // Check if running on binary or CodePush bundle
        if (!currentPackage) {
          console.log(
            'ℹ️ Running on binary version (no CodePush update installed yet)',
          );
        } else {
          console.log('✅ Running on CodePush bundle:', {
            label: currentPackage.label,
            appVersion: currentPackage.appVersion,
            deploymentKey: currentPackage.deploymentKey,
          });
        }

        // Check for remote updates
        const remotePackage = await CodePush.checkForUpdate(
          env.CODEPUSH_DEPLOYMENT_KEY,
        );

        if (!remotePackage) {
          console.log('✅ App is up to date - no remote updates available');
        } else {
          console.log('🆕 Update available:', {
            label: remotePackage.label,
            appVersion: remotePackage.appVersion,
            description: remotePackage.description,
            isMandatory: remotePackage.isMandatory,
            packageSize: remotePackage.packageSize,
          });
        }
      } catch (error) {
        console.error('❌ CodePush check failed:', error);
        setProgress(-1);
      }
    };

    if (isConfirm) {
      if (!CodePush) {
        console.warn('⚠️ CodePush is undefined. Make sure the native module is correctly linked.');
        return;
      }
      checkForUpdates();
      CodePush.sync(
        {
          deploymentKey: env.CODEPUSH_DEPLOYMENT_KEY,
          updateDialog: {
            title: i18n.t('core.screens.codepush.updateAvailable'),
            optionalUpdateMessage: i18n.t(
              'core.screens.codepush.contentUpdate',
            ),
            optionalIgnoreButtonLabel: i18n.t('core.screens.codepush.later'),
            optionalInstallButtonLabel: i18n.t('core.screens.codepush.install'),
            mandatoryUpdateMessage: i18n.t(
              'core.screens.codepush.mandatoryMessage',
            ),
            mandatoryContinueButtonLabel: i18n.t(
              'core.screens.codepush.install',
            ),
          },
          installMode: CodePush.InstallMode.IMMEDIATE,
        },
        codePushStatusDidChange,
        downloadProgressCallback,
      );

      CodePush.getUpdateMetadata()
        .then(setMetaData)
        .catch(() => undefined);
    }
    // If deploymentKey is omitted here, native-configured key is used (from Info.plist / BuildConfig)
  }, [
    codePushStatusDidChange,
    downloadProgressCallback,
    env.CODEPUSH_DEPLOYMENT_KEY,
    i18n,
    isConfirm,
  ]);

  const contextValue = useMemo<CodePushContextValue>(
    () => ({setProgress, metaData}),
    [metaData],
  );

  return (
    <CodePushContext.Provider value={contextValue}>
      {children}
      {progress >= 0 && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.statusText}>
            {statusUpdate}
            {progress > 0 ? ` ${progress}%` : ''}
          </Text>
        </View>
      )}
    </CodePushContext.Provider>
  );
});

export default CodePushProvider;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 9999,
  },
  statusText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
});
