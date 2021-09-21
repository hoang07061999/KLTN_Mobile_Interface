/* eslint-disable prettier/prettier */
/* eslint-disable keyword-spacing */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
class ViewHistory extends Component {
    constructor(props){
        super(props);
        this.state = {
            _idMember: '',
            currentQuestion: 0,
            isLoading: true,
            data: this.props.route.params.dataTest.questions,
        };
    }

    _anwser = (index) =>{
        switch (index){
            case 0: return 'A';
            case 1: return 'B';
            case 2: return 'C';
            case 3: return 'D';
            default: Alert.alert('Wrong!!');
        }
    };

    _nextQuestion = () =>{
        const { currentQuestion,data } = this.state;
        const nextQuestion = currentQuestion + 1;
        if(nextQuestion < data.length)
        {
            this.setState({
                currentQuestion: nextQuestion,
            });
        }
    }

    _previousQuestion = () => {
        const { currentQuestion } = this.state;
        const previousQuestion = currentQuestion - 1;
        if(previousQuestion >= 0)
        {
            this.setState({
                currentQuestion: previousQuestion,
            });
        }
    }

    componentDidMount(){
        const { dataTest } = this.props.route.params;
        AsyncStorage.getItem('idMember').then((value) => {
            if (value){
                this.setState({_idMember: value});
            }});
        setTimeout(()=>{
            if(dataTest.questions.length > 0)
            {
                this.setState({
                    isLoading: false,
                });
            }
        },2500);
    }

    render() {
        const { currentQuestion, data } = this.state;
        const { isComplete,isCorrect } = this.props.route.params.resuilt;
        console.log(this.props.route.params.resuilt.isComplete);
        return (
        this.state.isLoading ? <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
        <LottieView style={{height: 100, width: 100,justifyContent: 'center', alignItems: 'center'}} source={require('../../assets/flashScreen/22334-degree-icon-animation.json')} autoPlay loop />
        <Text style={{marginTop: 5}}> Xin vui lòng chờ trong giây lát .....</Text>
        </View> :
        <View style={{flex: 1}}>
            <View style={styles.container}>
            <View style={styles.wrapperHeader}>
                <View style={styles.wrapperHeaderIcon}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="times" size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.question_number}>{currentQuestion + 1}/{data.length}</Text>
                </View>
                <TouchableOpacity style={[styles.wrapperDone,{padding: 5}]} onPress={this.test}>
                    <Text style={styles.textDone}> Số câu đúng: {isCorrect.length}/{data.length} </Text>
                </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: 15}}>
                <View style={styles.wrapperQuestion}>
                    <Text style={styles.question}>{data[currentQuestion].content}</Text>
                </View>
                <View>
                    { data[currentQuestion].anwsers.map((e,index) =>{
                        return (
                            <View style={styles.wrapperAnswer} key={index}>
                                {
                                    isComplete.filter(x => x.id === data[currentQuestion].id).length > 0 ?
                                    isComplete[currentQuestion].index === index &&  isComplete[currentQuestion].isCorrect === true ?
                                    <Text style={{fontSize: 10, paddingBottom: 5, color: 'green'}}> Chúc mừng! Bạn trả lời đúng câu này </Text> :
                                    isComplete[currentQuestion].index === index ?
                                    <Text style={{fontSize: 10, paddingBottom: 5, color: 'orange'}}> Đáp án của bạn </Text> :
                                    e.isCorrect === true ?
                                    <Text style={{fontSize: 10, paddingBottom: 5, color: 'blue'}}> Đáp án đúng </Text> :
                                    <Text /> : e.isCorrect === true ? <Text style={{fontSize: 10, paddingBottom: 5, color: 'red'}}> Bạn đã bỏ qua câu này </Text> : <Text />
                                }
                                <View style={[styles.answerDone]}>
                                    <Text style={[styles.abcd,{backgroundColor: e.isCorrect === true ? '#06c425' : isComplete.filter(x => x.id === data[currentQuestion].id).length > 0 ? isComplete[currentQuestion].index === index ? 'red' : '#BDBDBD' : '#BDBDBD'}]}>{this._anwser(index)}</Text>
                                    <Text style={{width:'90%'}}>{e.anwser}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
                </View>
                <View style={styles.wrapperBottom}>
                    <TouchableOpacity onPress={this._previousQuestion}>
                        <Icon name="arrow-alt-circle-left" size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._nextQuestion}>
                        <Icon name="arrow-alt-circle-right" size={40}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'space-between',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.3)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
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
    wrapperHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 10, height: 0 },
        elevation: 10,
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    wrapperHeaderIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        },
    wrapperQuestion: {
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 10, height: 0 },
        elevation: 2,
        backgroundColor: 'white',
    },
    wrapperDone: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#84bf92',
        borderRadius: 20,
    },
    question_number :{
        fontSize: 18,
        color:'black',
        backgroundColor: '#84bf92',
        marginHorizontal: 30,
        paddingHorizontal: 8,
        borderRadius: 20,
    },
    question:{
        fontSize:17,
    },
    wrapperAnswer: {
        paddingHorizontal:10,
        borderTopWidth: 0.5,
        borderTopColor: '#e3e3e3',
        paddingVertical:20,
    },
    answerDone: {
        flexDirection:'row',
        alignItems:'center',
    },
    answer:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        borderTopWidth: 0.5,
        borderTopColor: '#e3e3e3',
        paddingVertical:20,
    },
    abcd:{
        borderRadius:100,
        fontSize:15,
        width:25,
        height:25,
        textAlign:'center',
        marginRight:20,
        color:'#585858',
        fontWeight:'700',
        backgroundColor: '#BDBDBD',
    },
    wrapperBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#9d9da1',
    },
    center: {
        flexDirection: 'row',
    },
    ImageModal: {
        height: 80,
        width: 80,
    },
    modalText: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingVertical: 5,
    },
    wrapResult: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    resultCorrect: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 0.5,
        paddingHorizontal: 10,
    },
    resultCorrectNumber: {
        fontSize: 30,
        color: 'green',
    },
    resultDone: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 0.5,
        paddingHorizontal: 10,
    },
    resultDoneNumber: {
        fontSize: 30,
        color: 'red',
    },
    buttonModal: {
        borderRadius: 20,
        backgroundColor: '#84bf92',
        padding: 10,
        paddingHorizontal: 20,
        marginTop: 5,
    },
    buttonModalText: {
        color: 'white',
        fontWeight: '700',
    },
});


const mapStateToProps = state =>{
    return {
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        addResuilt: (data) => dispatch({type: 'ADD_RESUILT_MEMBER_REQUEST', data}),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ViewHistory);
