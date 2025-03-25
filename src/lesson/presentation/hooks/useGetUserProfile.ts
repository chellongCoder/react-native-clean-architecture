import {useCallback, useEffect, useState} from 'react';
import {data} from 'src/authentication/application/types/GetUserProfileResponse';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';

const useGetUserProfile = () => {
  const {getUserProfile} = useAuthenticationStore();

  const [userProfile, setUserProfile] = useState<data>();

  const handleGetUserProfile = useCallback(async () => {
    const res = await getUserProfile();
    if (res.data) {
      setUserProfile(res.data);
    }
  }, [getUserProfile]);

  useEffect(() => {
    handleGetUserProfile();
  }, [handleGetUserProfile]);

  return {handleGetUserProfile, userProfile};
};

export default useGetUserProfile;
