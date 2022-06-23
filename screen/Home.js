/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const numColums = 3;
import {connect} from 'react-redux';
import {ENDPOINT} from '../endPoint';
import io from 'socket.io-client';
class Home extends Component {
  constructor(props) {
    super(props);
    this.socket = io(ENDPOINT);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.getTopic();
    this.props.connectIo(this.socket);
    this.props.handleDIspatchResuilt(this.socket);
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.props.getTopic();
    this.props.connectIo(this.socket);
    this.props.handleDIspatchResuilt(this.socket);
    setTimeout(() => {
      if (this.props.listTopic) {
        this.setState({
          refreshing: false,
        });
      }
    }, 1000);
  };

  render() {
    const {refreshing} = this.state;
    const {navigation} = this.props;
    const {listTopic} = this.props;
    return (
      <SafeAreaView style={style.contener}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <FlatList
            data={listTopic}
            renderItem={({item}) => (
              item.ExamTest.length > 0 && <TouchableOpacity
                style={{justifyContent: 'flex-start'}}
                activeOpacity={0.5}
                onPress={() => {
                  var random = Math.floor(Math.random() * item.ExamTest.length);
                  this.props.navigation.navigate('exercise', {
                    title: item.name,
                    dataTest: item.ExamTest[random],socket: this.socket,
                  });
                }}>
                <View style={style.conteiner}>
                  <Image
                    style={style.image}
                    source={{uri: `${ENDPOINT}/${item.image}`}}
                  />
                  <Text style={style.title}>{item.name}</Text>
                  <Text style={style.thiNgay}> Thi ngay </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `${item._id}`}
            numColumns={numColums}
          />
          <View style={style.wrapperSchedule}>
            <Text style={style.scheduleTitle}> Tiện ích </Text>
            <View style={style.hr} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={style.scheduleItem}
                onPress={() =>
                  navigation.navigate('oldTest', {title: 'Thi đề năm cũ', socket:this.socket})
                }>
                <Image
                  style={[style.scheduleImage,{borderRadius: 100}]}
                  source={require('../assets/image/icon-2.png')}
                />
                <Text style={style.scheduleLabel}> Thi đề năm cũ </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.scheduleItem}
                onPress={() => navigation.navigate('rank')}>
                <Image
                  style={style.scheduleImage}
                  source={require('../assets/image/Actions-rating-icon.png')}
                />
                <Text style={style.scheduleLabel}> Bảng xếp hạng </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={style.scheduleItem}
                onPress={() =>
                  navigation.navigate('schedule', {title: 'Thời khóa biểu'})
                }>
                <Image
                  style={style.scheduleImage}
                  source={require('../assets/image/schedule.png')}
                />
                <Text style={style.scheduleLabel}> Thời khóa biểu </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  contener: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingVertical: 20,
  },
  conteiner: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: {width: 10, height: 0},
    elevation: 10,
    marginBottom: 10,
    marginLeft: 20,
    height: 120,
    width: 110,
  },
  thiNgay: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#339AF0',
    width: 90,
    textAlign: 'center',
    color: 'white',
    marginTop: 1,
    backgroundColor: '#339AF0',
  },
  image: {
    marginTop: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  title: {
    paddingTop: 7,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  wrapperSchedule: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  scheduleTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  hr: {
    borderBottomColor: '#0080ff',
    borderBottomWidth: 4,
    width: '35%',
    marginLeft: 10,
  },
  scheduleImage: {
    height: 70,
    width: 70,
  },
  scheduleItem: {
    width: '50%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleLabel: {
    paddingTop: 5,
    fontSize: 15,
  },
});

const mapStateToProps = (state) => {
  return {
    listTopic: state.topic.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTopic: () => dispatch({type: 'GET_TOPIC_REQUEST'}),
    connectIo: async (socket) => {
      socket.emit('getMembers');
      socket.on('getAllMembers',function(members){
        dispatch({type: 'ALL_MEMBER_SUCCESS', payload: members});
      });
    },
    handleDIspatchResuilt: async (socket) =>{
      socket.on('dispatchResuilt', (data)=>{
        console.log('handle', data);
        dispatch({type: 'ENJECT_MEMBER_SUCCESS', payload: data});
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
