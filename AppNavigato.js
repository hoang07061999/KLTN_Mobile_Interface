/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import { connect } from 'react-redux';
import Home from './screen/Home';
import Alarm from './screen/schedules/alarm';
import HeaderHome from './screen/header/headerHome';
import NoteTime from './screen/schedules/nodetime';
import Exercise from './screen/exams/exercise';
import Profile from './screen/profiles/profile';
import Rank from './screen/ratings/rank';
import { Image, StyleSheet, View } from 'react-native';
import Login from './screen/auth/login';
import Register from './screen/auth/register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ViewHistory from './screen/exams/viewHistory';
import OldTest from './screen/feature/oldTest/oldTest';
import test from './screen/exams/test';
import Info from './screen/profiles/info';
import SearchEmail from './screen/auth/forgetPass/searchEmail';
import OTPcheck from './screen/auth/forgetPass/OTPcheck';
import ChangePass from './screen/auth/forgetPass/changePass';
const Stack = createStackNavigator();

class AppNavigator extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoginStore: '',
      hasdata: false,
    };
  }
  componentDidMount(){
    const that = this;
    GoogleSignin.configure({
      webClientId: '563776868206-q6214nihon0mqsrkqe3sbsruvirshjcn.apps.googleusercontent.com',
      offlineAccess: true,
    });
    this.props.getTopic();
    AsyncStorage.getItem('idMember').then((value) => {
      // this.setState({isLoginStore: value});
      if (value)
      {
        this.props.getProfileMember(value);
      }});
    AsyncStorage.getItem('token').then((value) => {
      // this.setState({isLoginStore: value});
      if (value)
      {
        if (this.props.listTopic)
        {
          setTimeout( () => {
            this.setState({hasdata: true,isLoginStore: value});
          },500);
          // that.setState({hasdata: true,isLoginStore: value});
        } else {
          that.setState({hasdata: false});
        }
      }
      else {
        console.log('false');
            setTimeout( () => {
              this.setState({hasdata: true});
            },500);
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if (nextProps.isLogin === '')
    {
      this.setState({isLoginStore: ''});
    }
  }


    render() {
        const {isLogin} = this.props;
        const {isLoginStore,hasdata} = this.state;
        return (
            <View style={{flex: 1}}>
            { hasdata ?
              isLogin || isLoginStore ? <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} options={({ navigation }) => ({ headerTitle: () => <HeaderHome {...navigation} /> })}/>
                <Stack.Screen name="Alarm" component={Alarm} options={({ route }) => ({ title: 'Thông báo' })}/>
                <Stack.Screen name="schedule" component={NoteTime} options={({ route }) => ({ title: route.params.title })}/>
                <Stack.Screen name="exercise" component={Exercise} options={({ route }) => ({ title: 'hello', headerShown: false})}/>
                <Stack.Screen name="viewHistory" component={ViewHistory} options={({ route }) => ({ title: 'hello', headerShown: false})}/>
                <Stack.Screen name="profile" component={Profile} options={({ route }) => ({ headerShown: false})}/>
                <Stack.Screen name="rank" component={Rank} options={({ route }) => ({ title: 'Bảng xếp hạng'})}/>
                <Stack.Screen name="oldTest" component={OldTest} options={({ route }) => ({ title: ' Thi đề năm cũ '})}/>
                <Stack.Screen name="exam" component={test} options={({ route }) => ({title: route.params.title ,data: route.params.examYear})}/>
                <Stack.Screen name="info" component={Info} options={({ route }) => ({title: 'Thông tin cá nhân'})}/>
              </Stack.Navigator> :
                <Stack.Navigator>
                  <Stack.Screen name="login" component={Login} options={({ route }) => ({headerShown: false})}/>
                  <Stack.Screen name="register" component={Register} options={({ route }) => ({headerShown: false})}/>
                  <Stack.Screen name="checkOTP" component={OTPcheck} options={({ route }) => ({headerShown: false})}/>
                  <Stack.Screen name="searchEmail" component={SearchEmail} options={({ route }) => ({headerShown: false})}/>
                  <Stack.Screen name="changePass" component={ChangePass} options={({ route }) => ({headerShown: false})}/>

                </Stack.Navigator> :
            <View style={styles.container}>
              <Image style={styles.image} source={require('./assets/image/logo/logo.png')}/>
          </View>}
            </View>
        );
      }
}
const styles =  StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  image: {
      height: 100,
      width: 100,
      borderRadius: 50,
  },
});

const mapStatesToProps = (state) =>{
  return {
    isLogin: state.auth.token,
    listTopic: state.topic.data,
  };
};

const mapDispatchsToProps = (dispatch) =>{
  return {
    getTopic: () => dispatch({type: 'GET_TOPIC_REQUEST'}),
    getProfileMember: (id) => dispatch({type: 'GET_PROFILE_MEMBER_REQUEST', id}),
  };
};

export default connect(mapStatesToProps,mapDispatchsToProps)(AppNavigator);

