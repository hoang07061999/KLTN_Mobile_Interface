/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import React, { Component } from 'react';
class SearchEmail extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            validate: false,
            validateEmail: false,
            validateEmailValid: false,
        };
    }

    _onChange = (text,name) =>{
        this.setState({
            email: text,
            validate: false,
            validateEmail: false,
            validateEmailValid: false,
        });
    };

    _validateEmail = () =>{
        // eslint-disable-next-line no-useless-escape
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (this.state.email && reg.test(this.state.email) === false)
      {
        this.setState({
            validateEmail: true,
        });
        return true;
      } return false;
    };

    _validate = () =>{
        if (this.state.email === '')
        {
            this.setState({
                validate: true,
            });
            return true;
        } return false;
    };

    _submit = () =>{
        if (!this._validateEmail() && !this._validate())
        {
            this.props.onSearchEmail(this.state.email);
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps && nextProps.emailValid !== null)
        {
            if (nextProps.emailValid === true)
            {
                console.log('run 2');
                this.props.navigation.navigate('checkOTP');
            } else {
                this.setState({
                    validateEmailValid: true,
                });
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
            <Text style={{fontSize: 15}}> TP Education </Text>
            <Text style={{fontSize: 20,marginTop: 10}}> Tìm email của bạn </Text>
            <Text> Tính năng chỉ áp dụng cho tài khoản đăng kí trực tiếp </Text>
            <View style={styles.wrapperInput}>
            <TextInput mode="outlined" label="Email" onChangeText={text => this._onChange(text, 'email')} />
            {this.state.validateEmail ? <Text style={{color: 'red'}}> Sai định dạng email </Text> : null }
            {this.state.validate ? <Text style={{color: 'red'}}> Vui lòng nhập email </Text> : null }
            {this.state.validateEmailValid ? <Text style={{color: 'red'}}>{this.props.msg}</Text> : null }
            </View>
            <View style={{flex: 1,width: '100%',justifyContent: 'flex-end',alignItems: 'flex-end',paddingRight: 15}}>
            <TouchableOpacity onPress={this._submit}>
              <Text style={{fontWeight: '600',backgroundColor: 'blue', width: 110,height: 40,textAlign: 'center',paddingTop: 10,color: 'white',borderRadius: 5}}> Tiếp theo </Text>
            </TouchableOpacity>
            </View>
          </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(48, 48, 47,0.4)',
    },
    wrapperInput:{
        height: 100,
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 30,
    },
});
const mapStatesToProps = state =>{
    return {
        emailValid: state.auth.emailValid,
        msg: state.auth.msgEmail,
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        onSearchEmail: (email) => dispatch({type: 'SEARCH_EMAIL_REQUEST',email}),
    };
};

export default connect(mapStatesToProps,mapDispatchToProps)(SearchEmail);
