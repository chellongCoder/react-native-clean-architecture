import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import ICDropDown from 'src/core/components/icons/ICDropDown';
import {COLORS} from 'src/core/presentation/constants/colors';
import {CustomTextStyle} from 'src/core/presentation/constants/typography';
import useStateCustom from 'src/hooks/useStateCommon';
import CommonInput from 'src/post/presentation/components/CommonInput';
import useLoginWithCredentials from '../hooks/useLoginWithCredentials';
import useAuthenticationStore from '../stores/useAuthenticationStore';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {Subject} from 'src/authentication/application/types/GetListSubjectResponse';

type TRegister = {
  name?: string;
  gender?: string;
  age?: number | string;
  subjectIds?: string[];
  listAllSubject?: Subject[];
};

const RegisterChildScreen = () => {
  const {handleRegisterChild, handleGetListAllSubject} =
    useLoginWithCredentials();
  const {isLoading} = useAuthenticationStore();
  useLoadingGlobal(isLoading);

  const [registerState, setRegisterState] = useStateCustom<TRegister>({
    name: '',
    gender: '',
    age: '',
    subjectIds: [],
    listAllSubject: [],
  });

  const onTextInputChange = (key: string, value: string) => {
    setRegisterState({
      [key]: value,
    });
  };

  const onSelectSubject = (subject: string) => {
    const subjectIds = registerState.subjectIds || [];
    const updatedSubjectIds = subjectIds.includes(subject)
      ? subjectIds.filter(id => id !== subject)
      : [...subjectIds, subject];

    setRegisterState({
      subjectIds: updatedSubjectIds,
    });
  };

  const onCreateAccount = () => {
    if (
      registerState.name === '' ||
      registerState.gender === '' ||
      registerState.age === '' ||
      registerState.subjectIds?.length === 0
    ) {
      return;
    } else {
      const params = {
        age: Number(registerState.age) || '',
        gender: registerState.gender?.toLowerCase() || '',
        name: registerState.name || '',
        subjectIds: registerState.subjectIds || [],
      };
      handleRegisterChild(params);
    }
  };

  const renderSubjectItem = ({item}: {item: Subject}) => {
    const isSelected =
      registerState?.subjectIds && registerState?.subjectIds.includes(item._id);
    return (
      <TouchableOpacity
        style={[
          styles.wrapSubjectItem,
          isSelected ? {backgroundColor: COLORS.YELLOW_F2B559} : {},
        ]}
        onPress={() => onSelectSubject(item._id)}>
        <Text
          style={[
            styles.subjectTitle,
            isSelected ? {color: COLORS.WHITE_FBF8CC} : {},
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const getListAllSubject = useCallback(async () => {
    const res = await handleGetListAllSubject();
    setRegisterState({listAllSubject: res});
  }, [handleGetListAllSubject, setRegisterState]);

  useEffect(() => {
    getListAllSubject();
  }, [getListAllSubject]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapContainer}>
        <TouchableOpacity style={styles.wrapHeaderContainer}>
          <Text style={styles.headerTitle}>Eng</Text>
          <ICDropDown />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.wrapBodyContainer}>
            <CommonInput
              label="Child's name"
              textInputProp={{
                placeholder: 'Thomas',
                value: registerState.name,
                onChangeText: (e: string) => {
                  onTextInputChange('name', e);
                },
              }}
            />

            <View style={styles.genderAgeContainer}>
              <CommonInput
                label="Generality"
                textInputProp={{
                  placeholder: 'Male',
                  value: registerState.gender,
                  onChangeText: (e: string) => {
                    onTextInputChange('gender', e);
                  },
                }}
                contentContainerStyle={{flex: 0.4}}
              />

              <CommonInput
                label="Age"
                textInputProp={{
                  placeholder: '4 years old',
                  value: registerState.age as string,
                  onChangeText: (e: string) => {
                    onTextInputChange('age', e);
                  },
                }}
                contentContainerStyle={{flex: 0.4}}
                inputMode={'numeric'}
              />
            </View>

            <View style={styles.wrapSubjectContainer}>
              <Text style={styles.subjectHeaderTitle}>Want to study</Text>

              <FlatList
                data={registerState?.listAllSubject || []}
                renderItem={renderSubjectItem}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.wrapButtonContainer}
          onPress={onCreateAccount}>
          <Text style={styles.buttonTitle}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE_FBF8CC,
  },
  wrapContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingBottom: scale(32),
  },
  wrapHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_FFE699,
    paddingVertical: scale(4),
    borderRadius: 30,
    paddingLeft: scale(12),
    width: '20%',
  },
  headerTitle: {
    ...CustomTextStyle.smallBold,
    color: COLORS.BLUE_1C6349,
    marginRight: scale(8),
  },
  wrapBodyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  genderAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapSubjectContainer: {},
  subjectHeaderTitle: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
    paddingBottom: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: scale(32),
  },
  wrapButtonContainer: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.GREEN_66C270,
    width: '50%',
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.WHITE_FBF8CC,
  },
  wrapSubjectItem: {
    height: 64,
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: COLORS.GREEN_DDF598,
    marginBottom: scale(12),
  },
  subjectTitle: {
    ...CustomTextStyle.body1_bold,
    color: COLORS.BLUE_1C6349,
  },
});

export default RegisterChildScreen;
