/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
} from 'react-native';
import TimeTableView from 'react-native-timetable';

export default class NoteTime extends Component {
  constructor(props) {
    super(props);
    this.numOfDays = 6;
  }

  onEventPress = (evt) => {
    Alert.alert('onEventPress');
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Text style={styles.title}>Buổi sáng</Text>
          <View style={styles.container}>
            <TimeTableView
              pivotTime={1}
              pivotEndTime={7}
              numberOfDays={this.numOfDays}
              onEventPress={this.onEventPress}
              headerStyle={styles.headerStyle}
              locale="vi"
            />
          </View>
        </SafeAreaView>
        <SafeAreaView style={{flex: 1}}>
          <Text style={styles.title}>Buổi trưa</Text>
          <View style={styles.container}>
            <TimeTableView
              pivotTime={1}
              pivotEndTime={7}
              numberOfDays={this.numOfDays}
              onEventPress={this.onEventPress}
              headerStyle={styles.headerStyle}
              locale="vi"
            />
          </View>
        </SafeAreaView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#81E1B8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
  },
});
