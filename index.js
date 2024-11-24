import { AppRegistry } from 'react-native';
import App from './app/index';  // or your main app file

import appConfig from './app.json';
const appName = appConfig.expo.name;

AppRegistry.registerComponent(appName, () => App);
