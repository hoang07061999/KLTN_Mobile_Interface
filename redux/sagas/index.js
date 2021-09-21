/* eslint-disable prettier/prettier */
import {all} from 'redux-saga/effects';
import loginRun from './auth/login';
import topicRun from './topics/topic';
const sagas = function* () {
  yield all([loginRun(),topicRun()]);
};
export default sagas;
