/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT } from '../../endPoint';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressComplete from '../Progress/progressComplete';
import { Rating } from 'react-native-ratings';
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ten: '',
            ho: '',
            avatar: '',
            image: '',
            modalVisible: false,
            listTest: null,
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

    componentDidMount() {
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


    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.profile) {
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
        const { listTopic } = this.props;
        const { history } = this.props;
        const { listTest } = this.state;
        const getListTest = () => {
            let resuilt = [];
            listTopic.map(items => (
                items.ExamTest.map(item => resuilt.push(item)),
                items.ExamYear.map(test => (
                    test.tests.map(item => resuilt.push(item))
                ))
            ))
            let array = [];
            history.forEach(items => (
                resuilt.forEach(item => {
                    if (item._id === items._idTest) {
                        array.push(item);
                    }
                }
                )
            ))
            return array;
        }

        console.log(getListTest());

        const correct = (id) => {
            for (let i = 0; i < history.length; i++) {
                if (history[i]._idTest === id) {
                    return history[i].isCorrect.length > 0 ? history[i].isCorrect.length : 0;
                }
            }
            return null;
        };
        const percent = (id) => {
            for (let i = 0; i < history.length; i++) {
                if (history[i]._idTest === id) {
                    return Math.round(history[i].percentComplete);
                }
            }
            return null;
        };

        const start = (id) => {
            for (let i = 0; i < history.length; i++) {
                if (history[i]._idTest === id) {
                    return history[i].isCorrect.length;
                }
            }
            return null;
        };

        const viewResuilt = (id, dataTest) => {
            for (let i = 0; i < history.length; i++) {
                if (history[i]._idTest === id) {
                    this.props.navigation.navigate('viewHistory', { dataTest: dataTest, resuilt: history[i] });
                    return history[i];
                }
            }
            return null;
        };
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={image ? { uri: image } : avatar ? { uri: `${ENDPOINT}/${avatar}` } : require('../../assets/image/anhdemo.png')} style={{ resizeMode: 'cover' }}>
                    <View style={[styles.BoxImage, { backgroundColor: 'rgba(92, 92, 92, 0.7)', position: 'relative' }]}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10, left: 15 }} onPress={() => this.props.navigation.goBack()}>
                            <Icon style={styles.icon} name="arrow-left" size={25} color="white" />
                        </TouchableOpacity>
                        <Image style={styles.image} source={image ? { uri: image } : avatar ? { uri: `${ENDPOINT}/${avatar}` } : require('../../assets/image/anhdemo.png')} />
                        <Text style={styles.textInfo}>
                            {ho ? ho : ''} {ten ? ten : ''}
                        </Text>
                    </View>
                </ImageBackground>
                <TouchableHighlight style={{ marginTop: 30, marginBottom: 5 }} underlayColor="#e5e5e5" onPress={() => this.props.navigation.navigate('info')}>
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

                {/* Lịch sử làm bài */}
                <Text style={{ padding: 15, fontWeight: 'bold', fontSize: 20 }}> Lịch sử làm bài </Text>
                <ScrollView>
                    {getListTest() ? getListTest().map((e, index) => (
                        <TouchableOpacity key={index} style={styles.content} onPress={() => this.props.navigation.navigate('exercise', { dataTest: e, socket: this.props.route.params.socket })}>
                            <View>
                                {percent(e._id) ? <ProgressComplete percent={percent(e._id)} /> : <ProgressComplete percent={0} />}
                            </View>
                            <View style={{ flex: 1 }}>
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
                                <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row' }}>
                                    {start(e._id) !== null ?
                                        <Rating
                                            style={{ paddingLeft: 8, paddingTop: 5 }}
                                            ratingCount={5}
                                            imageSize={25}
                                            defaultRating={0}
                                            readonly={true}
                                            startingValue={Number((5 / e.questions.length) * start(e._id))}
                                        /> : <View />}
                                    {start(e._id) !== null ? <TouchableOpacity onPress={() => viewResuilt(e._id, e)} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, height: 35 }}>
                                        <Text style={{ borderWidth: 1, borderRadius: 20, padding: 2, backgroundColor: 'green', color: 'white' }}> Xem lại kết quả </Text>
                                    </TouchableOpacity> : <View />}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )) : null}
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    BoxImage: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    image: {
        height: 120,
        width: 120,
        borderRadius: 100,
    },
    textInfo: {
        fontWeight: 'bold',
        fontSize: 25,
        paddingTop: 5,
        color: 'white',
    },
    BoxMenu: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
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
        paddingLeft: 10,
    },
    content: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 5,
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
        textTransform: 'uppercase', marginRight: 50,
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


const mapStatesToProps = (state) => {
    return {
        profile: state.auth.data,
        history: state.auth.history,
        listTopic: state.topic.data,
    };
};

const mapDispatchsToProps = (dispatch) => {
    return {
        logOut: () => dispatch({ type: 'LOGOUT_SUCCESS' }),
    };
};

export default connect(mapStatesToProps, mapDispatchsToProps)(Profile);

