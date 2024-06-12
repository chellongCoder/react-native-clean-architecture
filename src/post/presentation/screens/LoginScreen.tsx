import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import PrimaryButton from '../components/PrimaryButton';
import CommonInput, {CommonInputPassword} from '../components/CommonInput';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import {getInstalledApps} from 'react-native-alphadex-screentime';

const LoginScreen = () => {
  const commonStyle = useGlobalStyle();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const onGoHomeScreen = () => {
    navigateScreen(STACK_NAVIGATOR.BOTTOM_TAB_SCREENS);
  };

  const onLogin = async () => {
    const apps = await getInstalledApps();
    console.log(
      '🛠 LOG: 🚀 --> --------------------------------------🛠 LOG: 🚀 -->',
    );
    console.log('🛠 LOG: 🚀 --> ~ onLogin ~ apps:', apps);
    console.log(
      '🛠 LOG: 🚀 --> --------------------------------------🛠 LOG: 🚀 -->',
    );
  };

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={[styles.fill]}>
        <View style={[styles.boxLang]}>
          <Text style={[commonStyle.txtLabel, styles.ph16]}>Eng</Text>
          <View style={[styles.arrowIcon]} />
        </View>

        <View style={[styles.fill, styles.justifyCenter]}>
          <CommonInput
            label="Email or phone number"
            textInputProp={{
              placeholder: 'Enter email or phone number',
              value: emailOrPhone,
              onChangeText: setEmailOrPhone,
            }}
          />

          <CommonInputPassword
            label="Password"
            textInputProp={{
              value: password,
              onChangeText: setPassword,
            }}
          />

          <Text style={[styles.txtLink]}>Forget password</Text>

          <View style={[styles.mt48]}>
            <Text style={[styles.txtLink, styles.mv8]}>Another account?</Text>
            <View style={[styles.rowAround]}>
              <PrimaryButton
                onPress={onGoHomeScreen}
                text="Register"
                style={styles.fill}
              />
              <View style={styles.mh12} />
              <PrimaryButton
                onPress={onLogin}
                text="Login"
                style={styles.fill}
              />
            </View>
          </View>
        </View>

        <View style={[]}>
          <Text style={[styles.txtLink, styles.mv8, styles.textCenter]}>
            Or log in with
          </Text>
          <PrimaryButton text="Google" wrapContent={false} style={styles.mv8} />
          <PrimaryButton text="Facebook" wrapContent={false} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbf8cc',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  boxLang: {
    backgroundColor: '#FFE699',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 40,
    padding: 5,
    borderRadius: 30,
  },
  arrowIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  ph16: {
    paddingHorizontal: 16,
  },
  mh12: {
    marginHorizontal: 12,
  },
  mv8: {
    marginVertical: 8,
  },
  mt48: {
    marginTop: 48,
  },
  txtLink: {
    fontFamily: FontFamily.Eina01Regular,
    fontSize: 10,
    textDecorationLine: 'underline',
    color: '#1C6349',
  },
  textCenter: {
    textAlign: 'center',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});