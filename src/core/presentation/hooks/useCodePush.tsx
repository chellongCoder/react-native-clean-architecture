import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Text, View, StyleSheet} from 'react-native';
import CodePush, {DownloadProgress, LocalPackage} from 'react-native-code-push';
import { coreModuleContainer } from 'src/core/CoreModule';
import Env, { EnvToken } from 'src/core/domain/entities/Env';

export type CodePushContextValue = {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  metaData: LocalPackage | null;
};

const CodePushContext = React.createContext<Partial<CodePushContextValue>>({});

export const useCodePush = () => useContext(CodePushContext);

type Props = {children: React.ReactNode};

const CodePushProvider: React.FC<Props> = ({children}) => {
    const env = coreModuleContainer.getProvided<Env>(EnvToken)
  const [progress, setProgress] = useState<number>(-1);
  const [statusUpdate, setStatusUpdate] = useState<string>('');
  const [metaData, setMetaData] = useState<LocalPackage | null>(null);

  const codePushStatusDidChange = (status: CodePush.SyncStatus) => {
    switch (status) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setProgress(0);
        setStatusUpdate('Checking for updates...');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setStatusUpdate('Downloading update...');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setStatusUpdate('Installing update...');
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        setStatusUpdate('Up to date.');
        setProgress(-1);
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setStatusUpdate('Update installed.');
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
    // If deploymentKey is omitted here, native-configured key is used (from Info.plist / BuildConfig)
    CodePush.sync(
      {
        deploymentKey: env.CODEPUSH_DEPLOYMENT_KEY,
        updateDialog: {
          title: 'Update available',
          optionalUpdateMessage: 'A new update is available. Would you like to install it?',
          optionalIgnoreButtonLabel: 'Later',
          optionalInstallButtonLabel: 'Install',
          mandatoryUpdateMessage: 'An update is required to continue.',
          mandatoryContinueButtonLabel: 'Install',
        },
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      codePushStatusDidChange,
      downloadProgressCallback,
    );

    CodePush.getUpdateMetadata().then(setMetaData).catch(() => undefined);
  }, [downloadProgressCallback]);

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
};

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


