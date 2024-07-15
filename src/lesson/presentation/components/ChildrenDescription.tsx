import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import IconEdit from 'assets/svg/IconEdit';
import useAuthenticationStore from 'src/authentication/presentation/stores/useAuthenticationStore';
import {
  children,
  data,
} from 'src/authentication/application/types/GetUserProfileResponse';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';

const ChildrenDescription = () => {
  const globalStyle = useGlobalStyle();
  const {selectedChild, getUserProfile} = useAuthenticationStore();
  const {handleChangeChildDescription} = useLoginWithCredentials();

  const [userProfile, setUserProfile] = React.useState<data>();
  const [isChangeChildDescription, setIsChangeChildDescription] =
    React.useState<boolean>(false);
  const [childDescription, setChildDescription] = React.useState<string>('');
  const [changeDescriptionSuccess, setChangeDescriptionSuccess] =
    React.useState<boolean>(false);

  const onChangeDescription = () => {
    setIsChangeChildDescription(true);
    setChangeDescriptionSuccess(false);
  };

  const onSubmit = async (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (e.nativeEvent.text === '' || e.nativeEvent.text.trim().length === 0) {
      return;
    } else {
      const res = await handleChangeChildDescription({
        childrenId: selectedChild?._id || '',
        description: e.nativeEvent.text,
      });
      if (res && res?.code === 200) {
        setChangeDescriptionSuccess(true);
      }
      setIsChangeChildDescription(false);
    }
  };

  const handleGetUserProfile = React.useCallback(async () => {
    const res = await getUserProfile();
    if (res.data) {
      setUserProfile(res.data);
    }
  }, [getUserProfile]);

  React.useEffect(() => {
    handleGetUserProfile();
  }, [changeDescriptionSuccess, handleGetUserProfile]);

  return (
    <View style={[styles.fill, styles.mr16]}>
      <TouchableOpacity
        style={[styles.rowHCenter, styles.fill, styles.rowBetween]}
        onPress={onChangeDescription}>
        <Text style={[globalStyle.txtLabel, styles.txtParentName]}>
          Child’s Description
        </Text>
        <IconEdit />
      </TouchableOpacity>
      {isChangeChildDescription ? (
        <TextInput
          autoFocus
          value={childDescription}
          onChangeText={setChildDescription}
          onBlur={() => setIsChangeChildDescription(false)}
          onSubmitEditing={(
            e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
          ) => onSubmit(e)}
        />
      ) : (
        <Text style={[globalStyle.txtNote, styles.mb12]}>
          {userProfile &&
          userProfile?.children.filter(
            (item: children) => item._id === selectedChild?._id,
          )[0].description.length > 0
            ? userProfile?.children.filter(
                (item: children) => item._id === selectedChild?._id,
              )[0].description
            : `Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text Lorem
        Ipsum has been....`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  mr16: {
    marginRight: 16,
  },
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  txtParentName: {
    color: '#1C6349',
    marginRight: 12,
  },
  mb12: {
    marginBottom: 12,
  },
});

export default ChildrenDescription;
