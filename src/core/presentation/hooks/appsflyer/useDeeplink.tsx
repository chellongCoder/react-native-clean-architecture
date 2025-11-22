import {useEffect} from 'react';
import appsFlyer from 'react-native-appsflyer';
import {isAndroid} from '../../utils';
import {useCampaign} from 'src/authentication/presentation/hooks/useCampaign';
import {CampaignE} from '../../navigation/types';
import {getAndroidId, getDeviceToken} from 'react-native-device-info';
import {logCampaignAttribution, logCampaignDeepLink} from '../../utils/analyticsHelper';

type UseDeeplinkOptions = {
	initializeSdk?: boolean;
};

const useDeeplink = ({initializeSdk = false}: UseDeeplinkOptions = {}) => {
	const {postCampaign} = useCampaign();

	// Initialize AppsFlyer SDK (logic previously in App.tsx)
	useEffect(() => {
		if (!initializeSdk) {
			return;
		}

		const initializeAppsFlyer = () => {
			appsFlyer.initSdk(
				{
					devKey: 'WgiQWB8TNKSTGf96jjqBXa',
					isDebug: !!__DEV__,
					appId: '41*****44',
					onInstallConversionDataListener: true,
					onDeepLinkListener: true,
					timeToWaitForATTUserAuthorization: 10,
					manualStart: false,
				},
				result => {
					console.log('appsFlyer result: ', result);
				},
				error => {
					console.error('appsFlyer error: ', error);
				},
			);

			appsFlyer.anonymizeUser(true);
			if (isAndroid) {
				appsFlyer.setCollectAndroidID(false);
				appsFlyer.setCollectIMEI(false);
			}
		};

		initializeAppsFlyer();
	}, [initializeSdk]);

	const getDeviceIdentifier = async (): Promise<string> => {
		let deviceToken: string | undefined;

		if (isAndroid) {
			await getAndroidId().then((androidId: string) => {
				deviceToken = androidId;
			});
		} else {
			await getDeviceToken().then((iosId: string) => {
				deviceToken = iosId;
			});
		}

		return deviceToken ?? 'string';
	};

	// Install conversion listener (logic previously in RootNavigator.listenAttribution)
	useEffect(() => {
		const listenAttribution = async () => {
			appsFlyer.onInstallConversionData(async data => {
				if (
					data.type === 'onInstallConversionDataLoaded' &&
					data.data.is_first_launch
				) {
					const attrData = data.data;
					const mediaSource = attrData.media_source;
					const campaign = attrData.campaign as CampaignE;
					const referralCode = attrData.path;
					const influencerId = attrData.influencer_id;

					console.log(
						'Install from:',
						mediaSource,
						'Campaign:',
						campaign,
						'Referral:',
						referralCode,
					);

					const deviceToken = await getDeviceIdentifier();

					if (influencerId) {
						return;
					}

					const params = {
						mediaSource: mediaSource ?? 'string',
						campaignName: campaign ?? 'string',
						referCode: referralCode ?? 'string',
						deviceToken,
						influencerId: influencerId ?? '',
						token: 'alphadex',
					};

					await logCampaignAttribution({
						mediaSource,
						campaignName: campaign,
						referralCode,
						deviceToken,
						influencerId,
					});

					postCampaign(params);
				}
			});

			appsFlyer.onInstallConversionFailure(error => {
				console.error('Attribution error:', error);
			});
		};

		listenAttribution();
	}, [postCampaign]);

	// Deep link listener (logic previously in RootNavigator.useEffect)
	useEffect(() => {
		const deepLinkListener = appsFlyer.onDeepLink(async res => {
			console.log('Deep link data:', res);

			if (
				res.status === 'success' &&
				res.deepLinkStatus === 'FOUND' &&
				res.data?.influencer_id
			) {
				const influencerId = res.data.influencer_id;
				const campaign = res.data.campaign;
				const mediaSource = res.data.media_source;
				const referralCode = res.data.path;

				const deviceToken = await getDeviceIdentifier();

				const params = {
					mediaSource: mediaSource ?? 'string',
					campaignName: campaign ?? 'string',
					referCode: referralCode ?? 'string',
					deviceToken,
					influencerId: influencerId ?? '',
					token: 'alphadex',
				};

				await logCampaignDeepLink({
					mediaSource,
					campaignName: campaign,
					referralCode,
					deviceToken,
					influencerId,
				});

				postCampaign(params);
			}
		});

		return () => {
			deepLinkListener();
		};
	}, [postCampaign]);
};

export default useDeeplink;

