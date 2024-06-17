import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {CommonInputPassword} from 'src/authentication/presentation/components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';
import {replaceScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {withProviders} from 'src/core/presentation/utils/withProviders';
import {LessonStoreProvider} from '../stores/LessonStore/LessonStoreProvider';
import {LessonStore} from '../stores/LessonStore/LessonStore';
import {lessonModuleContainer} from 'src/lesson/LessonModule';

const AuthParentScreen = () => {
  const [password, setPassword] = useState('');

  const lessonStore = lessonModuleContainer.getProvided(LessonStore);

  const onSubmit = () => {
    if (password.length === 4) {
      lessonStore.setPasswordParent(password);
      replaceScreen(STACK_NAVIGATOR.PARENT.PARENT_SCREEN);
    } else {
      console.log(password);
    }
  };

  return (
    <View style={[styles.container]}>
      <ScrollView>
        <CommonInputPassword
          label="Enter password"
          textInputProp={{
            value: password,
            onChangeText: setPassword,
          }}
        />

        <PrimaryButton
          text="Enter"
          style={styles.btnEnter}
          onPress={onSubmit}
        />
      </ScrollView>
    </View>
  );
};

export default withProviders(LessonStoreProvider)(AuthParentScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8cc',
    paddingHorizontal: 30,
    paddingVertical: 40,
    paddingTop: 200,
  },
  btnEnter: {
    marginTop: 70,
  },
});
