/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';

class ChangePass extends Component {
    constructor(props){
        super(props);
        this.state = {
            newPass: '',
            rePass: '',
            validatePassLength: false,
            validateRePass: false,
            checked: false,
            passVisible: true,
        };
    }

    _onChange = (value, name) => {
        this.setState({
          [name]: value,
          validatePassLength: false,
        });
        if (name === 'rePass') {
          if (this.state.newPass === value) {
            this.setState({
              validateRePass: false,
            });
          } else {
            this.setState({
              validateRePass: true,
            });
          }
        }
      };

    _submit = () =>{
        if (!this.validatePassLength() &&
        !this.validateRePass())
        {
            const data = {
              id: this.props._idReset,
              password: this.state.newPass,
            };
            this.props.resetForgetPass(data);
        }
    }

    validateRePass = () => {
        if (this.state.newPass !== this.state.rePass) {
          this.setState({
            validateRePass: true,
          });
          return true;
        }
        return false;
      };

    validatePassLength = () => {
        if (this.state.newPass.length < 8) {
          this.setState({
            validatePassLength: true,
          });
          return true;
        }
        return false;
    };

    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps && nextProps.resetSuccess !== null)
        {
          if (nextProps.resetSuccess === true)
          {
            this.props.navigation.navigate('login');
          }
        }
    }

    render() {
        return (
            <View style={styles.container}>
            <Text style={{fontSize: 15}}> TP Education </Text>
            <Text style={{fontSize: 20,marginTop: 10}}> ?????t l???i m???t kh???u c???a b???n </Text>
            <View style={styles.wrapperInput}>
            <TextInput secureTextEntry={ this.state.passVisible ? true : false} mode="outlined" label="M???t kh???u m???i" onChangeText={text => this._onChange(text, 'newPass')} />
            {this.state.validatePassLength ? (
                <Text style={{marginBottom: 10, color: 'red'}}>
                  M???t kh???u ph???i d??i h??n 8 k?? t???
                </Text>
              ) : null}
            <TextInput secureTextEntry={ this.state.passVisible ? true : false} style={{marginTop: 30}} mode="outlined" label="X??c nh???n m???t kh???u" onChangeText={text => this._onChange(text, 'rePass')} />
            {this.state.validateRePass ? (
                <Text style={{marginBottom: 10, color: 'red'}}>
                  M???t kh???u kh??ng tr??ng kh???p
                </Text>
              ) : null}
              <View style={{flexDirection: 'row', alignItems: 'center',marginTop: 20}}>
              <Checkbox
              status={this.state.checked ? 'checked' : 'unchecked'}
              onPress={() => {
                  this.setState({
                      checked: !this.state.checked,
                      passVisible: !this.state.passVisible,
                  });
              }}
            />
                <Text> Hi???n th??? m???t kh???u </Text>
              </View>
            </View>
            <View style={{flex: 1,width: '100%',justifyContent: 'flex-end',alignItems: 'flex-end',paddingRight: 15}}>
            <TouchableOpacity onPress={this._submit}>
              <Text style={{fontWeight: '600',backgroundColor: 'blue', width: 110,height: 40,textAlign: 'center',paddingTop: 10,color: 'white',borderRadius: 5}}> Ti???p theo </Text>
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
        _idReset: state.auth._idReset,
        resetSuccess: state.auth.resetPass,
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        resetForgetPass: data =>
        dispatch({type: 'CHANGE_PASS_REQUEST', data}),
    };
};

export default connect(mapStatesToProps,mapDispatchToProps)(ChangePass);
