/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Modal, ActivityIndicator } from 'react-native';
import { TextInput} from 'react-native-paper';
import { connect } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            _txtEmail: '',
            _txtHo: '',
            _txtTen: '',
            _txtPass: '',
            _txtRePass: '',
            _txtImage: '',
            validateEmail: null,
            validatePass: null,
            validateRePass: null,
            modalVisible: false,
            isCreated: true,
        };
    }


    _onChange = (text, name) =>{
        this.setState({
            [name]: text,
        });
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
          if (name === '_txtRePass' && text !== this.state._txtPass) {
            this.setState({ validateRePass: true });
          }
        else if (name === '_txtRePass' && text === this.state._txtPass){
            this.setState({ validateRePass: false });
          }
        if (this.state.isCreated === false)
        {
            this.props.referentValidate();
        }
    }

    _register = () =>{
        var data = new FormData();
        data.append('email',this.state._txtEmail);
        data.append('ho',this.state._txtHo);
        data.append('ten',this.state._txtTen);
        data.append('avatar',this.state._txtImage);
        data.append('matkhau',this.state._txtPass);
        this.props.register(data);
        this.setState({
            modalVisible:  true,
        });
    }

    selectedImage = async () =>{
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.images],
            });
            this.setState({
                _txtImage: res,
            });
            console.log(
              res.uri,
              res.type, // mime type
              res.name,
              res.size
            );
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps && nextProps.isCreated === true)
        {
            this.setState({
                modalVisible: false,
            });
            this.props.navigation.navigate('login', {email: this.state._txtEmail});
            this.props.referentValidate();
        }
        else {
            this.setState({
                isCreated: false,
                modalVisible: false,
            });
            this.props.referentValidate();
        }
    }


    render() {
        const {validateEmail,validatePass,validateRePass, modalVisible, isCreated} = this.state;
        return (
            <View style={styles.container}>
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size={80} color="#0000ff" />
              </View>
            </View>
          </Modal>
            <KeyboardAvoidingView style={{width: '100%', justifyContent: 'center', alignItems: 'center',flex: 1}} behavior="height">
            <Image style={{height:100,width: 100,borderRadius:100}} source={require('../../assets/image/anhdemo.png')}/>
            <View style={styles.wrapperInput}>
                <TouchableOpacity onPress={this.selectedImage} style={{borderBottomWidth: 2,backgroundColor: '#e5e5e5', height: 50,justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}> Chọn avatar </Text>
                </TouchableOpacity>
                <TextInput label="Email (*)" onChangeText={text => this._onChange(text, '_txtEmail')}/>
                {validateEmail ? <Text style={{color: 'red'}}> Định dạng Email không đúng! </Text> : null}
                <TextInput label="Họ" onChangeText={text => this._onChange(text, '_txtHo')}/>
                <TextInput label="Tên" onChangeText={text => this._onChange(text, '_txtTen')}/>
                <TextInput secureTextEntry={true} label="Mật khẩu (*)" onChangeText={text => this._onChange(text, '_txtPass')}/>
                {validatePass ? <Text style={{color: 'red'}}> Mật khẩu phải dài hơn 8 kí tự! </Text> : null}
                <TextInput secureTextEntry={true} label="Xác nhận mật khẩu (*)" onChangeText={text => this._onChange(text, '_txtRePass')}/>
                {validateRePass ? <Text style={{color: 'red'}}> Mật khẩu không trùng khớp </Text> : null}
            </View>
            {isCreated ? null : <Text style={{color: 'red',paddingBottom: 5}}> Vui lòng kiểm tra lại thông tin đăng kí! </Text>}
            <TouchableOpacity disabled={validateEmail === false && validatePass === false && validateRePass === false ? false : true} style={[styles.buttonRegister,{backgroundColor: validateEmail === false && validatePass === false && validateRePass === false ? '#43ed1c' : '#e5e5e5'}]} onPress={this._register}>
                <Text>
                    Đăng kí
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        paddingVertical: 10,
    },
    wrapperInput: {
        width: '90%',
        borderRadius: 20,
        paddingVertical: 10,
        overflow: 'hidden',
    },
    buttonRegister: {
        backgroundColor: '#e5e5e5',
        height: 50,
        width: '87%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(1,0,0,0.1)',
      },
      modalView: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
});


const mapStatesToProps = (state) =>{
    return {
        isCreated: state.auth.isCreated,
    };
};

const mapDispatchsToProps = (dispatch) =>{
    return {
        register: (data) => dispatch({type: 'REGISTER_REQUEST',data}),
        referentValidate: () => dispatch({type: 'REFERVALIDATE_SUCCESS'}),
    };
};


export default connect(mapStatesToProps,mapDispatchsToProps)(Register);

