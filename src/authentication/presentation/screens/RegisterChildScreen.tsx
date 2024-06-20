import React, {useCallback, useEffect, useState} from 'react';
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
import CommonInput, {
  CommonDropDown,
  ItemType,
} from 'src/post/presentation/components/CommonInput';
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

const initialRegisterState: TRegister = {
  name: '',
  gender: 'male',
  age: 5,
  subjectIds: [],
  listAllSubject: [],
};

const RegisterChildScreen: React.FC = () => {
  const {handleRegisterChild, handleGetListAllSubject} =
    useLoginWithCredentials();
  const {isLoading} = useAuthenticationStore();
  useLoadingGlobal(isLoading);

  const [genderOptions, setGenderOptions] = useState<ItemType[]>([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);
  const [ageOptions, setAgeOptions] = useState<ItemType[]>(
    Array.from({length: 15}, (_, i) => ({label: `${i + 5}`, value: i + 5})),
  );

  const [registerState, setRegisterState] =
    useStateCustom<TRegister>(initialRegisterState);

  const [genderOpen, setGenderOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);

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
    const {name, gender, age, subjectIds} = registerState;
    if (!name || !gender || !age || !subjectIds?.length) {
      return;
    }

    const params = {
      age: Number(age) || '',
      gender: gender.toLowerCase() || '',
      name: name || '',
      subjectIds: subjectIds || [],
    };
    handleRegisterChild(params);
  };

  const renderSubjectItem = ({item}: {item: Subject}) => {
    const isSelected = registerState.subjectIds?.includes(item._id);
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

  const setGenderValue = (callback: any) => {
    setRegisterState({gender: callback(registerState.gender)});
  };

  const setAgeValue = (callback: any) => {
    setRegisterState({age: callback(registerState.age)});
  };

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
                onChangeText: (e: string) => onTextInputChange('name', e),
              }}
            />

            <View style={styles.genderAgeContainer}>
              <CommonDropDown
                label="Gender"
                open={genderOpen}
                value={registerState.gender || genderOptions[0].value}
                items={genderOptions}
                setOpen={setGenderOpen}
                setValue={setGenderValue}
                setItems={setGenderOptions}
              />

              <CommonDropDown
                label="Age"
                open={ageOpen}
                value={registerState.age || ageOptions[0].value.toString()}
                items={ageOptions}
                setOpen={setAgeOpen}
                setValue={setAgeValue}
                setItems={setAgeOptions}
              />
            </View>

            <View style={styles.wrapSubjectContainer}>
              <Text style={styles.subjectHeaderTitle}>Want to study</Text>

              <FlatList
                data={registerState.listAllSubject || []}
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
    zIndex: 999,
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
