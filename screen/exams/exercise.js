/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Exercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _idMember: '',
      currentQuestion: 0,
      isCorrect: [],
      modalVisible: false,
      isCompelete: [],
      isDone: false,
      isLoading: true,
      data: this.props.route.params.dataTest.questions,
      _isRunning: true,
      timer: 0,
    };
    this.countRef = React.createRef();
  }

  _anwser = (index) => {
    switch (index) {
      case 0:
        return 'A';
      case 1:
        return 'B';
      case 2:
        return 'C';
      case 3:
        return 'D';
      default:
        Alert.alert('Wrong!!');
    }
  };

  _nextQuestion = () => {
    const {currentQuestion, data} = this.state;
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < data.length) {
      this.setState({
        currentQuestion: nextQuestion,
      });
    } else {
      this.doneAlert();
    }
  };

  _selectedQuestion = (id, answer, isCorrect, index) => {
    const check = {
      id,
      isCorrect,
      index,
    };
    if (!this.state.isCompelete.includes(id)) {
      this.setState({
        isCompelete: [...this.state.isCompelete, check],
      });
    }
    if (isCorrect) {
      if (!this.state.isCorrect.includes(id)) {
        this.setState({isCorrect: [...this.state.isCorrect, check]});
      }
    } else {
      if (this.state.isCorrect.includes(id)) {
        for (var i = 0; i < this.state.isCorrect.length; i++) {
          if (this.state.isCorrect[i] === id) {
            this.state.isCorrect.splice(i, 1);
          }
        }
      }
    }
    this._nextQuestion();
  };

  _previousQuestion = () => {
    const {currentQuestion} = this.state;
    const previousQuestion = currentQuestion - 1;
    if (previousQuestion >= 0) {
      this.setState({
        currentQuestion: previousQuestion,
      });
    }
  };

  setModalVisible = (modalVisible) => this.setState({modalVisible});

  _onResuilt = () => {
    this.setState({
      isDone: true,
      modalVisible: false,
      currentQuestion: 0,
      _isRunning: false,
    });
    const {dataTest, title } = this.props.route.params;
    var percent = (this.state.isCorrect.length / this.state.data.length) * 100;
    var star = (5 / this.state.data.length) * this.state.isCorrect.length;
    var point =
      (Number(dataTest.diem) / Number(dataTest.questions.length)) *
      this.state.isCorrect.length;
    const getSeconds = `0${this.state.timer % 60}`.slice(-2);
    const minutes = `${Math.floor(this.state.timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(this.state.timer / 3600)}`.slice(-2);
    const timeComplete = `${getHours}:${getMinutes}:${getSeconds}`;
    const resuilt = {
        '_idTest': dataTest._id,
        'isComplete': this.state.isCompelete,
        'isCorrect' : this.state.isCorrect,
        'percentComplete' : percent,
        'point': point,
        'star': star,
        'time': timeComplete,
        'nameTest': dataTest.name,
        'topicName': title,
    };
    console.log('resuilt', resuilt);
    this.props.addResuilt({id:this.state._idMember,resuilt,socket: this.props.route.params.socket});
    this.setState({
        timer: 0,
    });
  };

  doneAlert = () => {
    this.setState({
      _isRunning: false,
    });
    clearInterval(this.countRef.current);
    Alert.alert(
      'Bạn có chắc chắn muốn nộp bài!',
      'Vẫn còn thời gian đấy !',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {
            this.setModalVisible(false);
            this.setState({_isRunning: true});
            this.countRef.current = setInterval(
                () =>
                  this.setState({
                    timer: this.state.timer + 1,
                  }),
                1000,
            );
          },
          style: 'cancel',
        },
        {text: 'Đồng ý', onPress: () => this.setModalVisible(true)},
      ],
      {cancelable: false},
    );
  };

  componentDidMount() {
    const {dataTest} = this.props.route.params;
    AsyncStorage.getItem('idMember').then((value) => {
      if (value) {
        this.setState({_idMember: value});
      }
    });
    setTimeout(() => {
      if (dataTest.questions.length > 0) {
        this.setState({
          isLoading: false,
        });
      }
    }, 2500);
    this.countRef.current = setInterval(
      () =>
        this.setState({
          timer: this.state.timer + 1,
        }),
      1000,
    );
  }

  render() {
    const {
      currentQuestion,
      modalVisible,
      isCorrect,
      isCompelete,
      isDone,
      data,
    } = this.state;
    const {dataTest} = this.props.route.params;
    return this.state.isLoading ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LottieView
          style={{
            height: 100,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../../assets/flashScreen/22334-degree-icon-animation.json')}
          autoPlay
          loop
        />
        <Text style={{marginTop: 5}}> Vui lòng chờ trong giây lát .....</Text>
      </View>
    ) : (
      <View style={{flex: 1}}>
        {isDone ? (
          <View style={styles.container}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Image
                    source={require('../../assets/image/clock.png')}
                    style={styles.ImageModal}
                  />
                  <Text style={styles.modalText}>Kết Quả</Text>
                  <View style={styles.wrapResult}>
                    <View style={styles.resultDone}>
                      <Text style={styles.resultDoneNumber}>
                        {isCompelete.length}/{data.length}
                      </Text>
                      <Text style={styles.resultDoneLabel}>Đã làm</Text>
                    </View>
                    <View style={styles.resultCorrect}>
                      <Text style={styles.resultCorrectNumber}>
                        {isCorrect.length}/{data.length}
                      </Text>
                      <Text style={styles.resultCorrectLabel}>Câu đúng</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.buttonModal}>
                    <Text style={styles.buttonModalText}> Xem đáp án </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={styles.wrapperHeader}>
              <View style={styles.wrapperHeaderIcon}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Icon name="times" size={30} />
                </TouchableOpacity>
                <Text style={styles.question_number}>
                  {currentQuestion + 1}/{data.length}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.wrapperDone, {padding: 5}]}
                onPress={this.test}>
                <Text style={styles.textDone}>
                  {' '}
                  Số câu đúng: {isCorrect.length}/{data.length}{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: 15}}>
              <View style={styles.wrapperQuestion}>
                <Text style={styles.question}>
                  {data[currentQuestion].content}
                </Text>
              </View>
              <View>
                {data[currentQuestion].anwsers.map((e, index) => {
                  return (
                    <View style={styles.wrapperAnswer} key={index}>
                      {isCompelete.filter(
                        (x) => x.id === data[currentQuestion].id,
                      ).length > 0 ? (
                        isCompelete[currentQuestion].index === index &&
                        isCompelete[currentQuestion].isCorrect === true ? (
                          <Text
                            style={{
                              fontSize: 10,
                              paddingBottom: 5,
                              color: 'green',
                            }}>
                            {' '}
                            Chúc mừng! Bạn trả lời đúng câu này{' '}
                          </Text>
                        ) : isCompelete[currentQuestion].index === index ? (
                          <Text
                            style={{
                              fontSize: 10,
                              paddingBottom: 5,
                              color: 'orange',
                            }}>
                            {' '}
                            Đáp án của bạn{' '}
                          </Text>
                        ) : e.isCorrect === true ? (
                          <Text
                            style={{
                              fontSize: 10,
                              paddingBottom: 5,
                              color: 'blue',
                            }}>
                            {' '}
                            Đáp án đúng{' '}
                          </Text>
                        ) : (
                          <Text />
                        )
                      ) : e.isCorrect === true ? (
                        <Text
                          style={{
                            fontSize: 10,
                            paddingBottom: 5,
                            color: 'red',
                          }}>
                          {' '}
                          Bạn đã bỏ qua câu này{' '}
                        </Text>
                      ) : (
                        <Text />
                      )}
                      <View
                        style={[styles.answerDone]}
                        onPress={() =>
                          this._selectedQuestion(
                            data[currentQuestion].id,
                            e.anwser,
                            e.isCorrect,
                            index,
                          )
                        }>
                        <Text
                          style={[
                            styles.abcd,
                            {
                              backgroundColor:
                                e.isCorrect === true
                                  ? '#06c425'
                                  : isCompelete.filter(
                                      (x) => x.id === data[currentQuestion].id,
                                    ).length > 0
                                  ? isCompelete[currentQuestion].index === index
                                    ? 'red'
                                    : '#BDBDBD'
                                  : '#BDBDBD',
                            },
                          ]}>
                          {this._anwser(index)}
                        </Text>
                        <Text style={{width: '90%'}}>{e.anwser}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.wrapperBottom}>
              <TouchableOpacity onPress={this._previousQuestion}>
                <Icon name="arrow-alt-circle-left" size={40} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() =>{
                const nextQuestion = currentQuestion + 1;
                if (nextQuestion < data.length) {
                  this.setState({
                    currentQuestion: nextQuestion,
                  });
                }
              }}>
                <Icon name="arrow-alt-circle-right" size={40} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Image
                    source={require('../../assets/image/clock.png')}
                    style={styles.ImageModal}
                  />
                  <Text style={styles.modalText}>Kết Quả</Text>
                  <View style={styles.wrapResult}>
                    <View style={styles.resultDone}>
                      <Text style={styles.resultDoneNumber}>
                        {isCompelete.length}/{data.length}
                      </Text>
                      <Text style={styles.resultDoneLabel}>Đã làm</Text>
                    </View>
                    <View style={styles.resultCorrect}>
                      <Text style={styles.resultCorrectNumber}>
                        {isCorrect.length}/{data.length}
                      </Text>
                      <Text style={styles.resultCorrectLabel}>Câu đúng</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.buttonModal}
                    onPress={this._onResuilt}>
                    <Text style={styles.buttonModalText}> Xem đáp án </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View style={styles.wrapperHeader}>
              <View style={styles.wrapperHeaderIcon}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Icon name="times" size={30} />
                </TouchableOpacity>
                <Text style={styles.question_number}>
                  {currentQuestion + 1}/{data.length}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.wrapperDone}
                onPress={this.doneAlert}>
                <Icon name="check-circle" size={30} />
                <Text style={styles.textDone}> Nộp bài </Text>
              </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: 15}}>
              <View style={styles.wrapperQuestion}>
                <Text style={styles.question}>
                  {data[currentQuestion].content}
                </Text>
              </View>
              <View>
                {data[currentQuestion].anwsers.map((e, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.answer}
                      key={index}
                      onPress={() =>
                        this._selectedQuestion(
                          data[currentQuestion].id,
                          e.anwser,
                          e.isCorrect,
                          index,
                        )
                      }>
                      <Text style={styles.abcd}>{this._anwser(index)}</Text>
                      <Text style={{width: '90%'}}>{e.anwser}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.wrapperBottom}>
              <TouchableOpacity onPress={this._previousQuestion}>
                <Icon name="arrow-alt-circle-left" size={40} />
              </TouchableOpacity>
              <View style={styles.center}>
                <CountDown
                  until={60 * dataTest.time}
                  size={15}
                  onFinish={() => this.setModalVisible(true)}
                  digitStyle={{backgroundColor: '#FFF'}}
                  digitTxtStyle={{color: '#1CC625'}}
                  timeToShow={['H', 'M', 'S']}
                  timeLabels={{m: null, s: null}}
                  onPress={() => alert('hello')}
                  running={this.state._isRunning}
                />
              </View>
              <TouchableOpacity onPress={this._nextQuestion}>
                <Icon name="arrow-alt-circle-right" size={40} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    shadowOffset: {width: 10, height: 0},
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
    shadowOffset: {width: 10, height: 0},
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
  question_number: {
    fontSize: 18,
    color: 'black',
    backgroundColor: '#84bf92',
    marginHorizontal: 30,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  question: {
    fontSize: 17,
  },
  wrapperAnswer: {
    paddingHorizontal: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#e3e3e3',
    paddingVertical: 20,
  },
  answerDone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#e3e3e3',
    paddingVertical: 20,
  },
  abcd: {
    borderRadius: 100,
    fontSize: 15,
    width: 25,
    height: 25,
    textAlign: 'center',
    marginRight: 20,
    color: '#585858',
    fontWeight: '700',
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

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addResuilt: (data) => {
      const { socket,id,resuilt } = data;
      socket.emit('addResuilt', {id}, resuilt, (res) => {
        console.log(res);

      });
      // socket.on('getAllMembers',function(members){
      //   console.log(members);
      //   dispatch({type: 'ALL_MEMBER_SUCCESS', payload: members});
      // });
      dispatch({type: 'ADD_RESUILT_MEMBER_SUCCESS', payload: resuilt});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Exercise);
