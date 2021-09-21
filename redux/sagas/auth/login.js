/* eslint-disable prettier/prettier */
import {takeLatest, put, all} from 'redux-saga/effects';
import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REQUEST_LOGIN,
  VALIDATE_LOGIN,
} from '../../types/auth/login';
import {ENDPOINT} from '../../../endPoint';
import {
  ADD_RESUILT_MEMBER_REQUEST,
  ADD_RESUILT_MEMBER_SUCCESS,
  CHANGE_PASS_REQUEST,
  CHANGE_PASS_SUCCESS,
  CHECK_OTP_REQUEST,
  CHECK_OTP_SUCCESS,
  GET_PROFILE_MEMBER_REQUEST,
  GET_PROFILE_MEMBER_SUCCESS,
  SEARCH_EMAIL_REQUEST,
  SEARCH_EMAIL_SUCCESS,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from '../../types/member/member';

function* register({data}) {
  try {
    const res = yield axios.post(`${ENDPOINT}/Member/create`, data);
    if (res.status === 201) {
      const dataRes = res.data.member;
      if (dataRes.accountType === 'Google') {
        const dataCreated = {
          email: dataRes.email,
          matkhau: data.matkhau,
        };
        yield put({type: LOGIN_REQUEST, data: dataCreated});
      }
      yield put({type: REGISTER_SUCCESS, payload: true});
    } else if (res.status === 204) {
      yield put({type: REGISTER_SUCCESS, payload: false});
    }
  } catch (error) {
  }
}

function* registerRequest() {
  yield takeLatest(REGISTER_REQUEST, register);
}

function* logIn({data}) {
  try {
    const res = yield axios.post(`${ENDPOINT}/Member/login`, data);
    if (res.status === 200) {
      const dataRes = res.data;
      yield put({type: LOGIN_SUCCESS, payload: dataRes});
    }
    if (res.status === 204) {
      yield put({type: REQUEST_LOGIN, payload: true});
    } else {
      yield put({type: VALIDATE_LOGIN, payload: true});
    }
  } catch (error) {}
}

function* logInRequest() {
  yield takeLatest(LOGIN_REQUEST, logIn);
}

function* addResuilt({data}) {
  try {
    const res = yield axios.post(
      `${ENDPOINT}/Member/add/resuilt/${data.id}`,
      data.resuilt,
    );
    if (res.status === 201) {
      yield put({type: ADD_RESUILT_MEMBER_SUCCESS, payload: data.resuilt});
    }
  } catch (error) {}
}

function* addResuiltRequest() {
  yield takeLatest(ADD_RESUILT_MEMBER_REQUEST, addResuilt);
}

function* getProfile({id}) {
  try {
    const res = yield axios.get(`${ENDPOINT}/Member/one/${id}`);
    if (res.status === 200) {
      yield put({type: GET_PROFILE_MEMBER_SUCCESS, payload: res.data});
    }
  } catch (error) {}
}

function* getProfileRequest() {
  yield takeLatest(GET_PROFILE_MEMBER_REQUEST, getProfile);
}

function* updateProfile({data}) {
  console.log(data);
  try {
    const res = yield axios.put(`${ENDPOINT}/Member/update/${data.id}`,data.data);
    console.log(res);
    if (res.status === 200) {
      yield put({type: UPDATE_PROFILE_SUCCESS, payload: res.data});
    }
  } catch (error) {}
}

function* updateProfileRequest() {
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfile);
}

function* searchEmail({email}) {
  console.log(email);
  try {
    const res = yield axios.post(`${ENDPOINT}/Member/searchEmail`,{email:email});
    console.log(res);
    if (res.status === 200) {
      yield put({type: SEARCH_EMAIL_SUCCESS, payload: res.data});
    }
  } catch (e) {
    console.log(e.response.data.msg)
    yield put({type: SEARCH_EMAIL_SUCCESS, payload: {correct: false, msg: e.response.data.msg}});
  }
}

function* searchEmailRequest() {
  yield takeLatest(SEARCH_EMAIL_REQUEST, searchEmail);
}

function* checkOTP({data}) {
  console.log(data);
  try {
    const res = yield axios.post(`${ENDPOINT}/Member/checkOTP`,{email:data.email,OTP: data.OTP});
    console.log(res);
    if (res.status === 200) {
      yield put({type: CHECK_OTP_SUCCESS, payload: res.data});
    }
  } catch (e) {
    console.log(e.response.data.msg);
    yield put({type: CHECK_OTP_SUCCESS, payload: {allow: false, _id: ''}});
  }
}

function* checkOTPRequest() {
  yield takeLatest(CHECK_OTP_REQUEST, checkOTP);
}

function* resetForgetPass({data}) {
  try {
    const res = yield axios.post(
      `${ENDPOINT}/Member/changePass`,
      {id: data.id, password: data.password}
    );
    console.log('========= res', res);
    if (res.status === 200) {
      yield put({type: CHANGE_PASS_SUCCESS, payload: res.data});
    }
  } catch (e) {
    yield put({
      type: CHANGE_PASS_SUCCESS,
      payload: {Success: false},
    });
  }
}

function* resetForgetPassRequest() {
  yield takeLatest(CHANGE_PASS_REQUEST, resetForgetPass);
}

export default function* () {
  yield all([
    logInRequest(),
    registerRequest(),
    addResuiltRequest(),
    getProfileRequest(),
    updateProfileRequest(),
    searchEmailRequest(),
    checkOTPRequest(),
    resetForgetPassRequest(),
  ]);
}
