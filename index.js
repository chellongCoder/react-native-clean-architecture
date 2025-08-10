import 'expo-dev-client';
import {registerRootComponent} from 'expo';
import {InversifySugar} from 'inversify-sugar';
import AppModule from './src/AppModule';
import App from './src/core/presentation/App';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

(() => {
  InversifySugar.options.defaultScope = 'Singleton';
  InversifySugar.run(AppModule);

  AppRegistry.registerComponent(appName, () => App);
})();
