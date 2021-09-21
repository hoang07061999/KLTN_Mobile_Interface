/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, FlatList } from 'react-native';

const numColumns = 2;
export default class ExamYear extends Component {
    constructor(props) {
        super(props);
            this.state = {
                selectedIndex: 0,
            };
    }

    // componentDidMount(){
    //     this._renderTest();
    // }

    _renderTest = (index,id) =>{
        this.setState({selectedIndex: index});
        this.props._changeExamYear(index);
    }

    render() {
        const { data } = this.props;
        const { selectedIndex } = this.state;
        return (
            <View style={styles.contener}>
                <FlatList
                    data={data}
                    renderItem={({ item, index}) =>
                    <TouchableOpacity style={[styles.buttom,{backgroundColor: selectedIndex === index ? '#1890d6' : 'rgba(17, 18, 18,0.2)'}]} onPress={() => this._renderTest(index,item._id)}>
                        <View style={styles.tongde}>
                            <Text>{item.tests.length}</Text>
                        </View>
                        <Text style={styles.text_buttom}>{item.name}</Text>
                    </TouchableOpacity>
                }
                keyExtraStyleSheetctor={item => `${item._id}`}
                numColumns={numColumns}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    contener: {
    paddingVertical: 10,
    backgroundColor:'#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    },
    buttom: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        marginHorizontal: 10,
        borderRadius: 15,
        margin:5,
        flexDirection:'row',
        justifyContent: 'center',
        padding: 7,
    },
    text_buttom: {
        fontWeight: '700',
    },
    tongde:{
        borderRadius:100,
        width:30,
        height:30,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginRight:5.0,
    },
});
