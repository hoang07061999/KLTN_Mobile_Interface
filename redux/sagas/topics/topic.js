/* eslint-disable prettier/prettier */
import {takeLatest, put, all} from 'redux-saga/effects';
import axios from 'axios';
import {ENDPOINT} from '../../../endPoint';
import {GET_TOPIC_REQUEST, GET_TOPIC_SUCCESS} from '../../types/topics/topic';

function* getTopic() {
  try {
    const res = yield axios.get(`${ENDPOINT}/topic`);
    if (res.status === 200) {
      const data = res.data;
      yield put({type: GET_TOPIC_SUCCESS, payload: data});
    }
  } catch (error) {}
}

function* getTopicRequest() {
  yield takeLatest(GET_TOPIC_REQUEST, getTopic);
}

export default function* () {
  yield all([getTopicRequest()]);
}
