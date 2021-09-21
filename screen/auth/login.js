/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View,TextInput, StyleSheet, Image } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { connect } from 'react-redux';

class Login extends Component {
    constructor(props){
      super(props);
      this.state = {
        _txtEmail: '',
        _txtPass: '',
        ho: '',
        ten: '',
        emailGoogle: '',
        passGoogle: '',
        imageGoogle: '',
        validateEmail: null,
        validatePass: null,
        validateLogin: null,
      };
    }

    _onChange = (text,name) => {
      // eslint-disable-next-line no-useless-escape
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (name === '_txtEmail' && reg.test(text) === false) {
        this.setState({ validateEmail: true });
      }
      else if (name === '_txtEmail' && reg.test(text) === true){
        this.setState({ validateEmail: false });
      }
      if (name === '_txtPass' && text.length < 8) {
        this.setState({ validatePass: true });
      }
      else if (name === '_txtPass' && text.length >= 8){
        this.setState({ validatePass: false });
      }
      this.setState({
        [name]: text,
      });
      if ( this.state.validateLogin === true)
      {
        this.setState({
          validateLogin: null,
        });
        this.props.referentValidate();
      }
    }

    signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const data = {
            'email': userInfo.user.email,
            'matkhau': userInfo.user.id,
          };
          this.props.logIn(data);
          this.setState({
            emailGoogle: userInfo.user.email,
            passGoogle: userInfo.user.id,
            ho: userInfo.user.familyName,
            ten: userInfo.user.givenName,
            imageGoogle: userInfo.user.photo,
          });
        } catch (error) {
          console.log('Message', error.message);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User Cancelled the Login Flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing In');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services Not Available or Outdated');
          } else {
            console.log('Some Other Error Happened');
          }
        }
      };

      isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!isSignedIn) {
          this.getCurrentUserInfo();
        } else {
          console.log('Please Login');
        }
      };

      getCurrentUserInfo = async () => {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          console.log(userInfo);
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            console.log('User has not signed in yet');
          } else {
            console.log("Something went wrong. Unable to get user's info");
          }
        }
      };
      signOut = async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (error) {
        }
      };

      componentDidMount(){
        GoogleSignin.configure({
          webClientId: '563776868206-q6214nihon0mqsrkqe3sbsruvirshjcn.apps.googleusercontent.com',
          offlineAccess: true,
        });
        this.isSignedIn();
      }

      _onLogin = () =>{
        const data = {
          'email': this.state._txtEmail,
          'matkhau': this.state._txtPass,
        };
        this.props.logIn(data);
        this.setState({
          validateLogin: false,
          _txtPass: '',
        });
      }

      UNSAFE_componentWillReceiveProps(nextprops){
        if (nextprops && nextprops.created){
          const data = {
            'email': this.state.emailGoogle,
            'matkhau': this.state.passGoogle,
            'image': this.state.imageGoogle,
            'ho': this.state.ho,
            'ten': this.state.ten,
            'accountType': 'Google',
          };
          this.props.register(data);
          this.setState({
            emailGoogle: '',
            passGoogle: '',
            imageGoogle: '',
            ho: '',
            ten: '',
          });
        }
        if (nextprops && nextprops.validateLogin && nextprops.created !== true)
        {
          this.setState({validateLogin: nextprops.validateLogin});
        }
        if (nextprops.route.params)
        {
          this.setState({
            _txtEmail: nextprops.route.params.email,
          });
        }
      }


    render() {
      const {validateEmail, validatePass, validateLogin,_txtEmail} = this.state;
        return (
            <View style={styles.container}>
            <Image style={{height: 100,width: 100,borderRadius: 100}} source={require('../../assets/image/anhdemo.png')} />
            <View style={{width: '100%',justifyContent: 'center',alignItems: 'center'}}>
            <View style={styles.wrapperInput}>
            <TextInput value={this.state._txtEmail} style={styles.email} placeholder="Email" onChangeText={text => this._onChange(text, '_txtEmail')}/>
            <TextInput value={this.state._txtPass} secureTextEntry style={styles.pass} placeholder="Mật khẩu" onChangeText={text => this._onChange(text, '_txtPass')}/>
          </View>
          {validateEmail ? <Text style={{paddingBottom: 15,color: 'red'}}> Định dạng Email không đúng! </Text> : null}
          {validatePass  ? <Text style={{paddingBottom: 15,color: 'red'}}> Mật khẩu phải dài hơn 8 kí tự </Text> : null}
          {validateLogin  ? <Text style={{paddingBottom: 15,color: 'red'}}> Email hoặc mật khẩu không chính xác </Text> : null}
          <TouchableOpacity disabled={validateEmail === false && validatePass === false || _txtEmail !== '' && validatePass === false ? false : true} style={[styles.wrapperButton,{backgroundColor: validateEmail === false && validatePass === false || _txtEmail !== '' && validatePass === false ? '#43ed1c' : '#e5e5e5'}]} onPress={this._onLogin}>
            <Text style={styles.buttonText}> Đăng nhập </Text>
          </TouchableOpacity>
          <Text style={{paddingTop: 10,textDecorationLine: 'underline'}} onPress={() => this.props.navigation.navigate('register')}> Bạn chưa có tài khoản ?</Text>
            </View>
            <View style={{paddingTop: 70,paddingBottom: 10}}>
              <Text style={{fontWeight: 'bold'}}> Or </Text>
            </View>
            <GoogleSigninButton
            style={{ width: 250, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.signIn}/>
            <TouchableOpacity style={{marginTop: 30}} onPress={() => this.props.navigation.navigate('searchEmail')}>
              <Text style={{textDecorationLine: 'underline'}}> Quên mật khẩu </Text>
            </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  wrapperInput: {
    borderWidth: 2,
    width: '90%',
    borderRadius: 20,
    margin: 20,
    overflow: 'hidden',
    borderColor: '#e5e5e5',
  },
  email: {
    borderBottomWidth: 2,
    backgroundColor: 'white',
    borderColor: '#e5e5e5',
    paddingHorizontal: 8,
  },
  pass: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
  },
  wrapperButton: {
    height: 50,
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const mapStatesToProps = (state) =>{
  return {
    created: state.auth.created,
    validateLogin: state.auth.validateLogin,
  };
};

const mapDispatchToProps = (dispatch) =>{
  return {
    logIn: (data) => dispatch({type: 'LOGIN_REQUEST', data}),
    register: (data) => dispatch({type: 'REGISTER_REQUEST',data}),
    referentValidate: () => dispatch({type: 'REFERVALIDATE_SUCCESS'}),
  };
};

export default connect(mapStatesToProps,mapDispatchToProps)(Login);

