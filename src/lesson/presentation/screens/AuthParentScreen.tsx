import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {CommonInputPassword} from 'src/authentication/presentation/components/CommonInput';
import PrimaryButton from '../components/PrimaryButton';

const AuthParentScreen = () => {
  const [password, setPassword] = useState('');
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

        <PrimaryButton text="Enter" style={styles.btnEnter} />
      </ScrollView>
    </View>
  );
};

export default AuthParentScreen;

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
