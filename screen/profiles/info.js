/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {ENDPOINT} from '../../endPoint';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native-paper';
class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ten: '',
      ho: '',
      avatar: '',
      image: '',
      email: '',
      modalVisible: false,
      content: '',
      newPass: '',
      reNewPass: '',
      validatePassLength: false,
      validateRePass: false,
      id: '',
      accountType: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('memberProfile').then((value) => {
      const data = JSON.parse(value);
      this.setState({
        id: data._id,
        ho: data.ho,
        ten: data.ten,
        avatar: data.avatar,
        image: data.image,
        email: data.email,
        accountType: data.accountType,
      });
    });
  }

  // UNSAFE_componentWillReceiveProps(nextProps){
  //   console.log("hello")
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.profile) {
      this.setState({
        ho: nextProps.profile.ho,
        ten: nextProps.profile.ten,
        avatar: nextProps.profile.avatar,
        image: nextProps.profile.image,
        email: nextProps.profile.email,
        id: nextProps.profile._id,
        accountType: nextProps.profile.accountType,
      });
    }
  }

  _onChange = (value, name) => {
    this.setState({
      [name]: value,
      validatePassLength: false,
    });
    if (name === 'reNewPass') {
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

  validateRePass = () => {
    if (this.state.newPass !== this.state.reNewPass) {
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

  submit = () => {
    this.validatePassLength();
    if (this.state.newPass) {
      if (!this.validateRePass()) {
        const data = {
          ho: this.state.ho,
          ten: this.state.ten,
          matkhau: this.state.newPass,
        };
        this.props.updateProfile({data, id: this.state.id});
        this.setState({
          modalVisible: false,
        });
      }
    }
    const data = {
      ho: this.state.ho,
      ten: this.state.ten,
      matkhau: this.state.newPass,
    };
    this.props.updateProfile({data, id: this.state.id});
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {ho, ten, avatar, image, email, modalVisible, content} = this.state;
    console.log(this.props);
    return (
      <View style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !modalVisible});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {content === 'name' ? (
                <View style={{width: 270}}>
                  <TextInput
                    value={ho}
                    style={{
                      height: 50,
                      marginBottom: 10,
                      borderRadius: 20,
                      overflow: 'hidden',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    label="Họ"
                    onChangeText={(text) => this._onChange(text, 'ho')}
                  />
                  <TextInput
                    value={ten}
                    style={{
                      height: 50,
                      borderRadius: 20,
                      overflow: 'hidden',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    label="Tên"
                    onChangeText={(text) => this._onChange(text, 'ten')}
                  />
                </View>
              ) : content === 'pass' ? (
                <View style={{width: 270}}>
                  <TextInput
                    secureTextEntry={true}
                    style={{
                      height: 50,
                      marginBottom: 1,
                      borderRadius: 20,
                      overflow: 'hidden',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    label="Mật khẩu mới"
                    onChangeText={(text) => this._onChange(text, 'newPass')}
                  />
                  {this.state.validatePassLength ? (
                    <Text style={{marginBottom: 10, color: 'red'}}>
                      Mật khẩu phải dài hơn 8 kí tự
                    </Text>
                  ) : null}
                  <TextInput
                    secureTextEntry={true}
                    style={{
                      height: 50,
                      borderRadius: 20,
                      overflow: 'hidden',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    label="Xác nhận mật khẩu"
                    onChangeText={(text) => this._onChange(text, 'reNewPass')}
                  />
                  {this.state.validateRePass ? (
                    <Text style={{marginBottom: 10, color: 'red'}}>
                      Mật khẩu không trùng khớp
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Text />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'flex-end',
                  width: '70%',
                }}>
                <TouchableOpacity
                  onPress={() => this.setState({modalVisible: false})}
                  style={{
                    backgroundColor: 'orange',
                    height: 30,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                  }}>
                  <Text style={{color: 'white'}}> Thoát </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.submit}
                  style={{
                    marginLeft: 5,
                    backgroundColor: '#28A745',
                    height: 30,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                  }}>
                  <Text style={{color: 'white'}}> Thay đổi </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ImageBackground
          source={
            image
              ? {uri: image}
              : avatar
              ? {uri: `${ENDPOINT}/${avatar}`}
              : require('../../assets/image/anhdemo.png')
          }
          style={{resizeMode: 'cover'}}>
          <View
            style={[
              styles.BoxImage,
              {backgroundColor: 'rgba(92, 92, 92, 0.7)', position: 'relative'},
            ]}>
            <Image
              style={styles.image}
              source={
                image
                  ? {uri: image}
                  : avatar
                  ? {uri: `${ENDPOINT}/${avatar}`}
                  : require('../../assets/image/anhdemo.png')
              }
            />
            {this.state.accountType === 'Google' ? null :
            <TouchableOpacity
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(92, 92, 92, 0.5)',
                color: 'white',
                width: 150,
                bottom: 30,
                height: 75,
                textAlign: 'center',
                paddingTop: 25,
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100,
              }}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Thay đổi
              </Text>
            </TouchableOpacity> }
          </View>
        </ImageBackground>
        <TouchableHighlight
          style={{marginTop: 30, marginBottom: 5}}
          underlayColor="#e5e5e5"
          onPress={() => this.setState({modalVisible: true, content: 'name'})}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 20,
            }}>
            <View style={styles.BoxMenu}>
              <Text style={{fontSize: 15, fontWeight: '700'}}> Tên </Text>
              <Text style={styles.textTitle}>{`${ho} ${ten}`}</Text>
            </View>
            <Icon style={styles.icon} name="chevron-right" size={20} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#e5e5e5"
          style={{marginTop: 5, marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 20,
            }}>
            <View style={styles.BoxMenu}>
              <Text style={{fontSize: 15, fontWeight: '700'}}> Email </Text>
              <Text style={styles.textTitle}>{email}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          disabled={this.state.accountType === 'Google' ? true : false}
          underlayColor="#e5e5e5"
          onPress={() => this.setState({modalVisible: true, content: 'pass'})}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 20,
            }}>
            <View style={styles.BoxMenu}>
              <Text style={{fontSize: 15, fontWeight: '700'}}> Mật khẩu </Text>
              <Text style={styles.textTitle}>*********</Text>
            </View>
            {this.state.accountType === 'Google' ? null : (
              <Icon style={styles.icon} name="chevron-right" size={20} />
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  BoxImage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  textInfo: {
    fontWeight: 'bold',
    fontSize: 25,
    paddingTop: 5,
    color: 'white',
  },
  BoxMenu: {
    paddingHorizontal: 15,
    height: 50,
  },
  wrapIcon: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  wrapIconInfo: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  textTitle: {
    opacity: 0.6,
    paddingLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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

const mapStatesToProps = (state) => {
  return {
    profile: state.auth.data,
  };
};

const mapDispatchsToProps = (dispatch) => {
  return {
    updateProfile: (data) => dispatch({type: 'UPDATE_PROFILE_REQUEST', data}),
  };
};

export default connect(mapStatesToProps, mapDispatchsToProps)(Info);
