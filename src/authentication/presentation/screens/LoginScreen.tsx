import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import PrimaryButton from '../components/PrimaryButton';
import CommonInput, {CommonInputPassword} from '../components/CommonInput';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';
import useLoginWithCredentials from 'src/authentication/presentation/hooks/useLoginWithCredentials';
import {observer} from 'mobx-react';
import {useLoadingGlobal} from 'src/core/presentation/hooks/loading/useLoadingGlobal';
import {navigateScreen} from 'src/core/presentation/navigation/actions/RootNavigationActions';
import {STACK_NAVIGATOR} from 'src/core/presentation/navigation/ConstantNavigator';
import {scale, verticalScale} from 'react-native-size-matters';
import Dropdown from 'src/core/components/dropdown/Dropdown';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import useGoogleLogin from 'src/hooks/useGoogleLogin';
import {COLORS} from 'src/core/presentation/constants/colors';

const LoginScreen = observer(() => {
  const {handleLoginWithCredentials} = useLoginWithCredentials();
  useLoadingGlobal();
  const {handleLoginViaGoogle} = useGoogleLogin();
  const globalStyle = useGlobalStyle();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('Eng');
  const onLogin = () => {
    const params = {
      email: emailOrPhone.toLowerCase(),
      password,
    };
    handleLoginWithCredentials(params);
  };

  const onRegister = () => {
    navigateScreen(STACK_NAVIGATOR.AUTH.REGISTER_SCREEN, {});
  };

  return (
    <ImageBackground
      style={[styles.container]}
      source={require('../../../../assets/images/authBackground.png')}>
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={[styles.wrapContentContainer]}>
        <Dropdown
          title={lang}
          width={scale(76)}
          onSelectItem={item => setLang(item)}
          data={['Eng', 'Vie']}
        />

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

          {/* <Text style={[styles.txtLink]}>Forget password</Text> */}

          <View style={[styles.mt48]}>
            {/* <Text style={[styles.txtLink, styles.mv8]}>Another account?</Text> */}
            <View style={[styles.rowAround, {paddingHorizontal: scale(16)}]}>
              {/* <PrimaryButton
                text="Register"
                style={styles.fill}
                onPress={onRegister}
              /> */}
              {/* <View style={styles.mh12} /> */}
              <PrimaryButton
                text="Login"
                style={styles.fill}
                onPress={onLogin}
              />
            </View>
          </View>
        </View>

        <View style={[{paddingHorizontal: scale(16)}]}>
          <Text style={[styles.txtLink, styles.mv8, styles.textCenter]}>
            Or log in with
          </Text>
          <PrimaryButton
            onPress={() => {
              handleLoginViaGoogle();
            }}
            text="Google"
            wrapContent={false}
            style={[
              styles.mv8,
              {
                backgroundColor: COLORS.YELLOW_F2B559,
              },
            ]}
          />
          {/* <PrimaryButton
            text="Facebook"
            wrapContent={false}
            style={[
              {
                backgroundColor: COLORS.YELLOW_F2B559,
              },
            ]}
          /> */}
          <TouchableOpacity
            onPress={onRegister}
            style={{marginVertical: scale(32)}}>
            <Text
              style={[
                globalStyle.txtLabel,
                styles.txtLink,
                styles.mv8,
                styles.textCenter,
              ]}>
              Don't have account?{' '}
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontFamily: FontFamily.SVNNeuzeitBold,
                }}>
                Sign up now
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default LoginScreen;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // This makes the overlay fill the entire ImageBackground
    backgroundColor: '#fbf8cc', // Adjust the color and opacity as needed
    opacity: 0.9,
  },
  wrapContentContainer: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  justifyCenter: {
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
  },
  boxLang: {
    backgroundColor: '#FFE699',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 40,
    // padding: 5,
    borderRadius: 30,
  },
  arrowIcon: {
    // width: 22,
    // height: 22,
    // borderRadius: 11,
    marginLeft: scale(5),
  },
  ph16: {
    paddingHorizontal: scale(16),
  },
  mh12: {
    marginHorizontal: 12,
  },
  mv8: {
    marginVertical: verticalScale(8),
  },
  mt48: {
    marginTop: scale(24),
    marginBottom: scale(48),
  },
  txtLink: {
    fontSize: scale(10),
    color: '#1C6349',
  },
  textCenter: {
    textAlign: 'center',
  },
  rowAround: {
    flexDirection: 'row',
  },
});
