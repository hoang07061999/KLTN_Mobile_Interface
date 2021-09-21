/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import { connect } from 'react-redux';

class OTPcheck extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
    this.state = {
      value0: '',
      value1: '',
      value2: '',
      value3: '',
      validate: false,
      validateOTP:  false,
    };
  }

  _goNextAfterEdit(name,text, index) {
    if (index < this.inputRefs.length - 1) {
        if (this.state)
      this.inputRefs[index + 1].focus();
    }
    if (text !== '')
    {
        this.setState({
            [name] : text,
            validate: false,
            validateOTP:  false,
          });
    }
  }

  _submit = () =>{
    this._validate();
    const { value0,value1,value2,value3} = this.state;
    if (!this._validate())
    {
        var otp = `${value0}${value1}${value2}${value3}`;
        this.props.onCheckOTP({email: 'hoang07061999@gmail.com',OTP: otp});
    }
  }

  _validate = () =>{
      if (this.state.value0 === '' || this.state.value1 === '' || this.state.value2 === '' || this.state.value3 === '')
      {
          this.setState({
              validate: true,
          });
          return true;
      }  return false;
  }

  UNSAFE_componentWillReceiveProps(nextProps){
      console.log(nextProps);
      if (nextProps && nextProps.OTPvalid !== null)
      {
        if (nextProps.OTPvalid === false)
        {
            this.setState({
                validateOTP: true,
            });
        } else {
            this.props.navigation.navigate('changePass');
        }
      }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(48, 48, 47,0.4)',
          paddingBottom: 30,
        }}>
        <View style={{alignItems: 'center', paddingTop: 50}}>
          <Text style={{fontSize: 15}}> TP Education </Text>
          <Text style={{fontSize: 20, marginTop: 10}}> Xác thực mã OTP </Text>
          <Text> Một mã OTP đã được gửi đến mail của bạn </Text>
        </View>
        <View
          style={{
            flex: 0.6,
            justifyContent: 'space-evenly',
            flexDirection: 'row',
          }}>
          {this.inputRefs.map((k, idx) => (
            <TextInput
              key={idx}
              style={{
                backgroundColor: '#f5f4f2',
                fontWeight: '600',
                alignSelf: 'center',
                padding: 10,
                fontSize: 20,
                height: 55,
                width: '10%',
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: 'gray',
                textAlign: 'center',
              }}
              autoCapitalize='none'
              onChangeText={(text) => this._goNextAfterEdit(`value${idx}`,text, idx)}
              ref={(r) => (this.inputRefs[idx] = r)}
              maxLength={1}
            />
          ))}
        </View>
        {this.state.validate ? <Text style={{textAlign: 'center',color: 'red'}}> Vui lòng nhập mã OTP </Text> : null }
        {this.state.validateOTP ? <Text style={{textAlign: 'center',color: 'red'}}> Mã OTP không chính xác </Text> : null }
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            paddingRight: 15,
          }}>
          <TouchableOpacity onPress={this._submit}>
            <Text
              style={{
                fontWeight: '600',
                backgroundColor: 'blue',
                width: 110,
                height: 40,
                textAlign: 'center',
                paddingTop: 10,
                color: 'white',
                borderRadius: 5,
              }}>
              Tiếp theo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStatesToProps = state =>{
    return {
        OTPvalid: state.auth.OTPvalid,
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        onCheckOTP: (data) => dispatch({type: 'CHECK_OTP_REQUEST',data}),
    };
};

export default connect(mapStatesToProps,mapDispatchToProps)(OTPcheck);
