import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert, Platform} from 'react-native';
import CodePush, {DownloadProgress, LocalPackage} from 'react-native-code-push';
import {getBundleId} from 'react-native-device-info';

import {coreModuleContainer} from 'src/core/CoreModule';
import Env, {EnvToken} from 'src/core/domain/entities/Env';

import CodePushStatusView, {
  CodePushPhase,
  CodePushPresentationMode,
} from '../components/CodePushStatusView';
import {useI18n} from './useI18n';

export type CodePushContextValue = {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  metaData: LocalPackage | null;
};

type Props = {children: React.ReactNode};

type CodePushUiState = {
  phase: CodePushPhase;
  progressPercent: number;
  statusText: string;
};

const PROD_RELEASE_BUNDLE_ID = 'com.algorz.abeeci.app';
const DEV_RELEASE_BUNDLE_ID = 'com.algorz.abeeci.app.dev';

const CodePushContext = React.createContext<Partial<CodePushContextValue>>({});

export const useCodePush = () => useContext(CodePushContext);

function CodePushProvider({children}: Props) {
  const env = coreModuleContainer.getProvided<Env>(EnvToken);
  const i18n = useI18n();
  const syncStartedRef = useRef(false);
  const bundleId = useMemo(() => getBundleId(), []);

  const [metaData, setMetaData] = useState<LocalPackage | null>(null);
  const [uiState, setUiState] = useState<CodePushUiState>({
    phase: 'idle',
    progressPercent: 0,
    statusText: '',
  });

  const codePushMode = useMemo<CodePushPresentationMode>(() => {
    if (!CodePush) {
      return 'disabled';
    }

    if (
      Platform.OS === 'android' &&
      !__DEV__ &&
      [PROD_RELEASE_BUNDLE_ID, DEV_RELEASE_BUNDLE_ID].includes(bundleId)
    ) {
      return 'floating';
    }

    return 'interactive';
  }, [bundleId]);

  const shouldPromptForRestart = useMemo(
    () =>
      Platform.OS === 'android' &&
      !__DEV__ &&
      bundleId === DEV_RELEASE_BUNDLE_ID,
    [bundleId],
  );

  const setProgress = useCallback((value: React.SetStateAction<number>) => {
    setUiState(previousState => {
      const nextProgress =
        typeof value === 'function'
          ? value(previousState.progressPercent)
          : value;

      if (nextProgress === previousState.progressPercent) {
        return previousState;
      }

      return {
        ...previousState,
        progressPercent: nextProgress,
      };
    });
  }, []);

  const setCodePushUiState = useCallback(
    (nextState: Partial<CodePushUiState>) => {
      setUiState(previousState => {
        const updatedState = {...previousState, ...nextState};

        if (
          updatedState.phase === previousState.phase &&
          updatedState.progressPercent === previousState.progressPercent &&
          updatedState.statusText === previousState.statusText
        ) {
          return previousState;
        }

        return updatedState;
      });
    },
    [],
  );

  const refreshMetaData = useCallback(async () => {
    try {
      const currentPackage = await CodePush.getUpdateMetadata();
      setMetaData(currentPackage);
      return currentPackage;
    } catch {
      return null;
    }
  }, []);

  const resetUiState = useCallback(() => {
    setCodePushUiState({
      phase: 'idle',
      progressPercent: 0,
      statusText: '',
    });
  }, [setCodePushUiState]);

  const codePushStatusDidChange = useCallback(
    (status: CodePush.SyncStatus) => {
      switch (status) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          resetUiState();
          break;
        case CodePush.SyncStatus.AWAITING_USER_ACTION:
          resetUiState();
          break;
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          setCodePushUiState({
            phase: 'downloading',
            statusText: i18n.t('core.screens.codepush.downloadingUpdate'),
          });
          break;
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          setCodePushUiState({
            phase: 'installing',
            statusText: i18n.t('core.screens.codepush.installingUpdate'),
          });
          break;
        case CodePush.SyncStatus.UP_TO_DATE:
          setCodePushUiState({
            phase: 'up_to_date',
            progressPercent: 0,
            statusText: i18n.t('core.screens.codepush.upToDate'),
          });
          break;
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          refreshMetaData()
            .then(currentPackage => {
              if (shouldPromptForRestart) {
                Alert.alert(
                  i18n.t('core.screens.codepush.updateInstalled'),
                  `${i18n.t('core.screens.codepush.contentUpdate')}\n\nLabel: ${
                    currentPackage?.label ?? '-'
                  }\nVersion: ${currentPackage?.appVersion ?? '-'}`,
                  [
                    {
                      text: i18n.t('core.screens.codepush.later'),
                      style: 'cancel',
                    },
                    {
                      text: i18n.t('core.screens.codepush.install'),
                      onPress: () => CodePush.restartApp(),
                    },
                  ],
                );
                return;
              }

              if (codePushMode === 'interactive') {
                Alert.alert(
                  i18n.t('core.screens.codepush.updateInstalled'),
                  `Label: ${currentPackage?.label ?? '-'}\nVersion: ${
                    currentPackage?.appVersion ?? '-'
                  }\nDeployment: ${currentPackage?.deploymentKey ?? '-'}`,
                );
              }
            })
            .catch(() => undefined);

          setCodePushUiState({
            phase: codePushMode === 'floating' ? 'ready' : 'idle',
            progressPercent: 100,
            statusText: i18n.t('core.screens.codepush.updateInstalled'),
          });
          break;
        case CodePush.SyncStatus.UPDATE_IGNORED:
          setCodePushUiState({
            phase: 'idle',
            progressPercent: 0,
            statusText: i18n.t('core.screens.codepush.updateIgnored'),
          });
          break;
        case CodePush.SyncStatus.UNKNOWN_ERROR:
          setCodePushUiState({
            phase: 'error',
            progressPercent: 0,
            statusText: i18n.t('core.screens.codepush.updateFailed'),
          });
          break;
        default:
          resetUiState();
          break;
      }
    },
    [
      codePushMode,
      i18n,
      refreshMetaData,
      resetUiState,
      setCodePushUiState,
      shouldPromptForRestart,
    ],
  );

  const downloadProgressCallback = useCallback(
    (progress: DownloadProgress) => {
      if (!progress.totalBytes) {
        return;
      }

      const progressPercent = Math.min(
        100,
        Math.round((progress.receivedBytes / progress.totalBytes) * 100),
      );

      setUiState(previousState => {
        if (
          previousState.phase === 'downloading' &&
          previousState.progressPercent === progressPercent
        ) {
          return previousState;
        }

        return {
          phase: 'downloading',
          progressPercent,
          statusText: i18n.t('core.screens.codepush.downloadingUpdate'),
        };
      });
    },
    [i18n],
  );

  useEffect(() => {
    refreshMetaData().catch(() => undefined);
  }, [refreshMetaData]);

  useEffect(() => {
    if (!CodePush || syncStartedRef.current) {
      return;
    }

    syncStartedRef.current = true;

    const syncOptions =
      codePushMode === 'floating'
        ? {
            deploymentKey: env.CODEPUSH_DEPLOYMENT_KEY,
            installMode: CodePush.InstallMode.ON_NEXT_RESTART,
            mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
            updateDialog: false,
          }
        : {
            deploymentKey: env.CODEPUSH_DEPLOYMENT_KEY,
            updateDialog: {
              title: i18n.t('core.screens.codepush.updateAvailable'),
              optionalUpdateMessage: i18n.t(
                'core.screens.codepush.contentUpdate',
              ),
              optionalIgnoreButtonLabel: i18n.t('core.screens.codepush.later'),
              optionalInstallButtonLabel: i18n.t(
                'core.screens.codepush.install',
              ),
              mandatoryUpdateMessage: i18n.t(
                'core.screens.codepush.mandatoryMessage',
              ),
              mandatoryContinueButtonLabel: i18n.t(
                'core.screens.codepush.install',
              ),
            },
            installMode: CodePush.InstallMode.ON_NEXT_SUSPEND,
          };

    CodePush.sync(
      syncOptions,
      codePushStatusDidChange,
      downloadProgressCallback,
    );
  }, [
    codePushMode,
    codePushStatusDidChange,
    downloadProgressCallback,
    env.CODEPUSH_DEPLOYMENT_KEY,
    i18n,
  ]);

  const contextValue = useMemo<CodePushContextValue>(
    () => ({setProgress, metaData}),
    [metaData, setProgress],
  );

  return (
    <CodePushContext.Provider value={contextValue}>
      {children}
      <CodePushStatusView
        mode={codePushMode}
        phase={uiState.phase}
        progressPercent={uiState.progressPercent}
        statusText={uiState.statusText}
      />
    </CodePushContext.Provider>
  );
}

export default CodePushProvider;
