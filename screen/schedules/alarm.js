/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Platform,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
export default function Alarm() {
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [listScedule, setListSchedule] = useState([]);

  const onChange = (event, selectedDate) => {
    const currentDate = date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    // eslint-disable-next-line keyword-spacing
    if (selectedDate) {
      PushNotification.localNotificationSchedule({
        channelId: 'channelNotification',
        message: 'Bạn ơi đã đến giờ học rồi đó!',
        date: selectedDate,
        repeatType: 'day',
      });
      PushNotification.getScheduledLocalNotifications((listNotification) => {
        setListSchedule([...listScedule, listNotification]);
      });
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const deleteAll = () => {
    PushNotification.cancelAllLocalNotifications();
    setListSchedule([]);
  };

  const cancleOne = (id) => {
    PushNotification.cancelLocalNotification({id: id});
    setListSchedule(listScedule.filter((e) => e.id !== id));
  };

  useEffect(() => {
    PushNotification.createChannel({
      channelId: 'channelNotification',
      channelName: 'My channel',
      channelDescription: 'A channel to categorise your notifications',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    });
    PushNotification.getScheduledLocalNotifications((listNotification) => {
      setListSchedule(listNotification);
    });
  }, []);

  console.log(listScedule);
  return (
    <View style={{flex: 1}}>
      <Text style={styles.text}>Đặt Lịch Học</Text>
      <View style={styles.icon}>
        <TouchableOpacity onPress={showTimepicker}>
          <Icon style={styles.plus} name="plus" size={15} />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteAll}>
          <Icon style={styles.menu} name="trash-alt" size={15} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {listScedule.map((e, index) => {
          return (
            <View style={styles.content} key={index}>
              <View>
                <Text style={{fontSize: 30}}>
                  {moment(e.date).format('HH:mm')}
                </Text>
              </View>
              <View
                style={{
                  width: 200,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Text style={styles.time}>
                  {moment(e.date).format('DD/MM')}
                </Text>
                <TouchableOpacity onPress={() => cancleOne(e.id)}>
                  <Icon
                    name="power-off"
                    size={30}
                    style={{paddingHorizontal: 20}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    paddingTop: 20,
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  plus: {
    fontSize: 20,
    fontWeight: '100',
    paddingRight: 20,
  },
  menu: {
    fontSize: 20,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 15,
    paddingLeft: 120,
  },
  turn: {
    paddingLeft: 20,
    marginVertical: 20,
  },
});
