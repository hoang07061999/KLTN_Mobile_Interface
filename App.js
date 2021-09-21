/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './AppNavigato';
import redux from './redux/config';
import { Text, View } from 'react-native';
export default class App extends Component {
  render() {
    return (
      <Provider store={redux.store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    );
  }
}
