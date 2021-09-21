/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default class FlashScreenHome extends Component {
    componentDidMount(){
        AsyncStorage.getItem('token').then((value) => {
            if(value)
            {
                this.props.navigation.navigate('appNavigation');
            }
          });
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/image/anhdemo.png')}/>
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
        height: 80,
        width: 80,
        borderRadius: 50,
    },
});

