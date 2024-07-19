import { registerRootComponent } from 'expo';

import App from './App';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { AppRegistry } from 'react-native';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent("App", () => App)
registerRootComponent(App);
 registerTranslation("en", enGB)
