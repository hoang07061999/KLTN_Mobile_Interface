/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT } from '../../endPoint';
class HeaderHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            avatar: '',
            image: '',
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('memberProfile').then((value) => {
            const data = JSON.parse(value);
            this.setState({
                avatar: data.avatar,
                image: data.image,
                resuilt: data.resuilt,
            });
          });
    }


    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps && nextProps.profile)
        {
            this.setState({
                avatar: nextProps.profile.avatar,
                image: nextProps.profile.image,
            });
        }
    }


    render() {
        const { avatar, image } = this.state;
        const { history } = this.props;

        const star = (data) =>{
            let resuilt = 0;
            for (let i = 0; i < data.length; i++)
            {
                resuilt += Number(history[i].star);
            }
            return resuilt.toFixed(1);
        };
        return (
            <View style={styles.container}>
                <View style={styles.conten}>
                    <TouchableOpacity onPress={() => this.props.navigate('profile')}>
                        <Image style={styles.imgProfile} source={image ? {uri: image} : avatar ? {uri: `${ENDPOINT}/${avatar}`}  :  require('../../assets/image/anhdemo.png')} />
                    </TouchableOpacity>
                    <View style={styles.textProfile}>
                        <Text style={styles.text}>Tổng số sao</Text>
                        <Text style={{fontSize: 20,fontWeight: 'bold'}}>{star(history)}<Icon name="star" color={'#fff700'} size={20}/></Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.props.navigate('Alarm')}>
                    <IconFA name="bell" size={30}/>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    conten: {
        flexDirection: 'row',
        alignItems:'center',
    },
    imgProfile: {
        width:40,
        height:40,
        borderRadius: 50,
    },
    textProfile: {
        paddingLeft: 15,
        flexDirection: 'column',
    },
    text: {
        color: '#848484',
    },
});


const mapStatesToProps = (state) =>{
    return {
        profile: state.auth.data,
        history: state.auth.history,
    };
};

const mapDispatchsToProps = (dispatch) =>{
    return {};
};

export default connect(mapStatesToProps,mapDispatchsToProps)(HeaderHome);
