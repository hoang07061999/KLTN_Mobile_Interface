/* eslint-disable prettier/prettier */
/* eslint-disable keyword-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
export default function ProgressComplete({percent}) {
    const size = 50;
    const strokeWidth = 4;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);
    const animation = (toValue) =>{
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        animation(percent);
    }, [percent]);
    useEffect(()=>{
        progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100;
            if(progressRef?.current){
                progressRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }
        });
    }, [percent]);

    return (
        <View style={styles.wrapperButton}>
        <Svg width= {size} height={size}>
        <G rotation="-90" origin={center}>
        <Circle
        stroke="#E6E7E8"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}/>
        <Circle
        ref={progressRef}
        stroke="#F4338F"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        />
        </G>
        </Svg>
        <View style={styles.button}>
            <Text style={styles.text}>{percent}%</Text>
        </View>
        </View>
        );
}


const styles = StyleSheet.create({
    wrapperButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
    },
    text: {
        fontSize: 10,
    },
});
