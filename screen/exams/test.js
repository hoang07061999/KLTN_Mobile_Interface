/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProgressComplete from '../Progress/progressComplete';
import ExamYear from './examYear';
import { Rating } from 'react-native-ratings';
import { connect } from 'react-redux';

class Test extends Component {
    constructor(props){
        super(props);
        this.state = {
            listtest: null,
        };
    }

    componentDidMount(){
        this.changeExamYear();
    }


    changeExamYear = (index = 0) =>{
        const { examYear } = this.props.route.params;
        this.setState({
            listtest: examYear[index],
        });
    }

    render() {
        const { history } = this.props;
        const { listtest } = this.state;
        const { examYear } = this.props.route.params;

        const correct = (id) => {
            for (let i = 0; i < history.length; i++)
            {
                if (history[i]._idTest === id)
                {
                    return history[i].isCorrect.length > 0 ? history[i].isCorrect.length : 0;
                }
            }
            return null;
        };
        const percent = (id) => {
            for (let i = 0; i < history.length; i++)
            {
                if (history[i]._idTest === id)
                {
                    return history[i].percentComplete;
                }
            }
            return null;
        };

        const start = (id) => {
            for (let i = 0; i < history.length; i++)
            {
                if (history[i]._idTest === id)
                {
                    return history[i].isCorrect.length;
                }
            }
            return null;
        };

        const viewResuilt = (id,dataTest) =>{
            for (let i = 0; i < history.length; i++)
            {
                if (history[i]._id === id)
                {
                    this.props.navigation.navigate('viewHistory', {dataTest: dataTest, resuilt: history[i]});
                    return history[i];
                }
            }
            return null;
        };


        return (
            <ScrollView>
                <ExamYear data={examYear} _changeExamYear={this.changeExamYear}/>
                { listtest ? listtest.tests.map((e,index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.content} onPress={() => this.props.navigation.navigate('exercise', {dataTest: e,socket: this.props.route.params.socket})}>
                        <View>
                            {percent(e._id) ? <ProgressComplete percent={percent(e._id)} /> : <ProgressComplete percent={0} />}
                        </View>
                        <View style={{flex: 1}}>
                        <View style={styles.container}>
                        <Text style={styles.title}>{e.name}</Text>
                        <View style={styles.wrapperIcon}>
                            <View style={styles.wrapperTime}>
                                <Icon name="clock" size={15} />
                                <Text> {e.time} phút</Text>
                            </View>
                            <View style={styles.wrapperTime}>
                                <Icon name="question-circle" size={15} />
                                <Text> {e.questions.length} câu</Text>
                            </View>
                            {correct(e._id) !== null ?
                            <View style={styles.wrapperTime}>
                                <Icon name="check-circle" size={15} />
                                <Text> {correct(e._id)} câu đúng </Text>
                            </View> : <View />}
                        </View>
                    </View>
                    <View style={{flex: 1,alignItems:'flex-start',flexDirection: 'row'}}>
                    {start(e._id) !== null ?
                    <Rating
                    style={{paddingLeft: 8,paddingTop: 5}}
                        ratingCount={5}
                        imageSize={25}
                        defaultRating={0}
                        readonly={true}
                        startingValue={Number((5 / e.questions.length) * start(e._id))}
                    /> : <View />}
                    {start(e._id) !== null ?  <TouchableOpacity onPress={() => viewResuilt(e._id,e)} style={{justifyContent: 'center',alignItems: 'center',flex: 1,height: 35}}>
                        <Text style={{borderWidth: 1,borderRadius: 20,padding: 2,backgroundColor:'green',color: 'white'}}> Xem lại kết quả </Text>
                        </TouchableOpacity> : <View />}
                    </View>
                        </View>
                    </TouchableOpacity>
                    );
                }) : null }
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        padding:10,
        backgroundColor:'#fff',
        margin:10,
        borderRadius:5,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    image: {
        height: 50, width: 50,
        borderRadius: 10,
    },

    title: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 11,
        textTransform: 'uppercase',marginRight:50,
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    wrapperIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 2,
    },
    wrapperTime: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
const mapStateToProps = state =>{
    return {
        history: state.auth.history,
    };
};

const mapDispatchToProps = dispatch =>{
    return {
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Test);
