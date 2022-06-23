/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const numColums = 3;
import { connect } from 'react-redux';
import { ENDPOINT } from '../../../endPoint';
class OldTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }


  componentDidMount() {
    this.props.getTopic();
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.props.getTopic();
    setTimeout(() => {
      if(this.props.listTopic)
      {
        this.setState({
          refreshing: false,
        });
      }
    }, 1000);
  }

  render() {
    const { refreshing } = this.state;
    const { navigation } = this.props;
    const { listTopic } = this.props;
    console.log(listTopic);
    return (
      <SafeAreaView style={style.contener}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <FlatList
            data={listTopic}
            renderItem={({ item }) => item.ExamYear.length > 0 && <TouchableOpacity style={{justifyContent: 'flex-start'}} activeOpacity={0.5}
              onPress={() => {
                this.props.navigation.navigate('exam', { title: item.name, examYear: item.ExamYear,socket: this.props.route.params.socket });
              }
              }
            >
              <View style={style.conteiner}>
                <Image style={style.image} source={{ uri: `${ENDPOINT}/${item.image}` }} />
                <Text style={style.title}>{item.name}</Text>
              </View>
            </TouchableOpacity>}
            keyExtractor={item => `${item._id}`}
            numColumns={numColums}
          />
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
    shadowOffset: { width: 10, height: 0 },
    elevation: 10,
    marginBottom: 10,
    marginLeft: 20,
    height: 90, width: 110,
  },
  image: {
    marginTop: 10,
    height: 50, width: 50,
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
    getTopic: () => dispatch({ type: 'GET_TOPIC_REQUEST' }),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(OldTest);

