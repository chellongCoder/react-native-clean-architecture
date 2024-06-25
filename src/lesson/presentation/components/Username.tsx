import IconEdit from 'assets/svg/IconEdit';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {data} from 'src/authentication/application/types/GetUserProfileResponse';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';

const Username = () => {
  const globalStyle = useGlobalStyle();
  const {getUserProfile} = useAuthenticationStore();
  const {handleChangeParentName} = useLoginWithCredentials();

  const [userProfile, setUserProfile] = useState<data>();
  const [isChangeUserName, setIsChangeUserName] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [changeUsernameSuccess, setChangeUsernameSuccess] =
    useState<boolean>(false);

  const onChangeUsername = () => {
    setIsChangeUserName(true);
    setChangeUsernameSuccess(false);
  };

  const onSubmit = async (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (e.nativeEvent.text === '' || e.nativeEvent.text.trim().length === 0) {
      return;
    } else {
      const res = await handleChangeParentName({name: e.nativeEvent.text});
      if (res && res?.code === 200) {
        setChangeUsernameSuccess(true);
      }
      setIsChangeUserName(false);
    }
  };

  const handleGetUserProfile = useCallback(async () => {
    const res = await getUserProfile();
    if (res.data) {
      setUserProfile(res.data);
    }
  }, [getUserProfile]);

  useEffect(() => {
    handleGetUserProfile();
  }, [changeUsernameSuccess, handleGetUserProfile]);

  return (
    <>
      <TouchableOpacity
        style={[styles.pt16, styles.rowHCenter]}
        onPress={onChangeUsername}>
        {isChangeUserName ? (
          <View>
            <TextInput
              autoFocus
              value={username}
              onChangeText={setUsername}
              onBlur={() => setIsChangeUserName(false)}
              onSubmitEditing={(
                e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
              ) => onSubmit(e)}
            />
          </View>
        ) : (
          <>
            <Text style={[globalStyle.txtLabel, styles.txtParentName]}>
              {userProfile?.username}
            </Text>
            <IconEdit />
          </>
        )}
      </TouchableOpacity>
      <Text style={[globalStyle.txtNote, styles.textColor]}>
        {userProfile?.emailOrPhoneNumber}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  pt16: {
    paddingTop: 16,
  },
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtParentName: {
    color: '#1C6349',
    marginRight: 12,
  },
  textColor: {
    color: '#1C6349',
  },
});

export default Username;
