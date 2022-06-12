import 'react-native-gesture-handler'; // 얘는 무조건 최상단에 있어야 함
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigations/AppNavigator';
import FlashMessage from 'react-native-flash-message';
import {LogBox} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
  }, []);
  LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <FlashMessage position="top" />
    </Provider>
  );
};
export default App;
