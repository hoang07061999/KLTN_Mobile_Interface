/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Image, ImageBackground,StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT } from '../../endPoint';
class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            ten: '',
            ho: '',
            avatar: '',
            image: '',
            modalVisible: false,
        };
    }


    _onLogOut = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!isSignedIn) {
            try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                this.props.logOut();
              } catch (error) {
                console.error(error);
              }
        } else {
            console.log('No sign by Google');
            this.props.logOut();
        }

    }

    componentDidMount(){
        AsyncStorage.getItem('memberProfile').then((value) => {
            const data = JSON.parse(value);
            this.setState({
                ho: data.ho,
                ten: data.ten,
                avatar: data.avatar,
                image: data.image,
            });
          });
    }


    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps && nextProps.profile)
        {
            this.setState({
                ho: nextProps.profile.ho,
                ten: nextProps.profile.ten,
                avatar: nextProps.profile.avatar,
                image: nextProps.profile.image,
            });
        }
    }

    render() {
        const { ho, ten, avatar, image } = this.state;
        return (
            <View style={{flex: 1}}>
            <ImageBackground source={ image ? {uri: image} : avatar ? {uri: `${ENDPOINT}/${avatar}`}  :  require('../../assets/image/anhdemo.png')} style={{resizeMode: 'cover'}}>
                <View style={[styles.BoxImage,{backgroundColor: 'rgba(92, 92, 92, 0.7)',position: 'relative'}]}>
                <TouchableOpacity style={{position: 'absolute',top: 10,left: 15}} onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.icon} name="arrow-left" size={25} color="white" />
                </TouchableOpacity>
                <Image style={styles.image} source={image ? {uri: image} : avatar ? {uri: `${ENDPOINT}/${avatar}`}  :  require('../../assets/image/anhdemo.png')}/>
                <Text style={styles.textInfo}>
                    {ho ? ho : ''} {ten ? ten : ''}
                </Text>
                </View>
            </ImageBackground>
            <TouchableHighlight style={{marginTop: 30,marginBottom: 5}} underlayColor="#e5e5e5" onPress={() => this.props.navigation.navigate('info')}>
            <View style={styles.BoxMenu}>
                <View style={styles.wrapIconInfo}>
                    <Icon style={styles.icon} name="user-circle" size={20} color="white" />
                </View>
                <Text style={styles.textTitle}> Thông tin cá nhân </Text>
            </View>
        </TouchableHighlight>
            <TouchableHighlight underlayColor="#e5e5e5" onPress={this._onLogOut}>
                <View style={styles.BoxMenu}>
                    <View style={styles.wrapIcon}>
                        <Icon style={styles.icon} name="sign-out-alt" size={20} color="white" />
                    </View>
                    <Text style={styles.textTitle}> Đăng xuất </Text>
                </View>
            </TouchableHighlight>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    BoxImage:{
        justifyContent:'center',
        alignItems: 'center',
        padding: 30,
    },
    image:{
        height: 120,
        width: 120,
        borderRadius: 100,
    },
    textInfo:{
        fontWeight: 'bold',
        fontSize: 25,
        paddingTop: 5,
        color: 'white',
    },
    BoxMenu:{
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems:'center',
        height: 50,
    },
    wrapIcon:{
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    wrapIconInfo:{
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    textTitle:{
        paddingLeft: 10,
    },
});


const mapStatesToProps = (state) =>{
    return {
        profile: state.auth.data,
    };
};

const mapDispatchsToProps = (dispatch) =>{
    return {
        logOut: () => dispatch({type: 'LOGOUT_SUCCESS'}),
    };
};

export default connect(mapStatesToProps,mapDispatchsToProps)(Profile);

