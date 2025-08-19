import {useCallback} from 'react';
import {AuthenticationStore} from '../stores/AuthenticationStore';
import {PostCampaignPayload} from 'src/authentication/application/types/PostCampaignPayload';
import { authenticationModuleContainer } from 'src/authentication/AuthenticationModule';

export const useCampaign = () => {
  const authStore = authenticationModuleContainer.getProvided(AuthenticationStore);

  const postCampaign = useCallback(
    async (campaignData: PostCampaignPayload) => {
      try {
        const response = await authStore.handlePostCampaign(campaignData);
        return response;
      } catch (error) {
        console.error('Campaign submission failed:', error);
        throw error;
      }
    },
    [authStore],
  );

  return {
    postCampaign,
    isLoading: authStore.isLoading,
  };
};
