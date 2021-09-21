/* eslint-disable prettier/prettier */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REFERVALIDATE_SUCCESS,
  REGISTER_SUCCESS,
  REQUEST_LOGIN,
  VALIDATE_LOGIN,
} from '../../types/auth/login';
import {
  ADD_RESUILT_MEMBER_SUCCESS,
  CHANGE_PASS_SUCCESS,
  CHECK_OTP_SUCCESS,
  GET_PROFILE_MEMBER_SUCCESS,
  SEARCH_EMAIL_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
} from '../../types/member/member';
const initData = {
  data: {},
  token: '',
  id: '',
  created: null,
  isCreated: null,
  validateLogin: false,
  history: [],
  isLogin: null,
  emailValid : null,
  msgEmail: '',
  OTPvalid: null,
  _idReset: '',
  resetPass: null,
};

var findID = (dataf, id) => {
  var resuilt = -1;
  dataf.forEach((data, index) => {
    if (data._idTest === id) {
      resuilt = index;
    }
  });
  return resuilt;
};

const Reducer = (state = initData, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      AsyncStorage.setItem('idMember', action.payload.member._id);
      AsyncStorage.setItem('token', action.payload.token);
      AsyncStorage.setItem(
        'memberProfile',
        JSON.stringify(action.payload.member),
      );
      return {
        ...state,
        data: action.payload.member,
        token: action.payload.token,
        id: action.payload.member._id,
        history: action.payload.member.resuilt,
      };
    case LOGOUT_SUCCESS:
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('idMember');
      AsyncStorage.removeItem('memberProfile');
      return {
        ...state,
        token: '',
        id: null,
        created: null,
        isCreated: null,
        validateLogin: false,
        data: null,
        isLogin: false,
      };
    case REQUEST_LOGIN:
      return {
        created: action.payload,
      };
    case VALIDATE_LOGIN:
      return {
        ...state,
        validateLogin: action.payload,
      };

    case REFERVALIDATE_SUCCESS:
      return {
        ...state,
        validateLogin: false,
        isCreated: null,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isCreated: action.payload,
      };
    case ADD_RESUILT_MEMBER_SUCCESS:
      var index = -1;
      index = findID(state.history, action.payload._idTest);
      if (index !== -1) {
        state.history[index] = action.payload;
      } else {
        state.history.push(action.payload);
      }
      return {
        ...state,
        history: [...state.history],
      };

    case GET_PROFILE_MEMBER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        id: action.payload._id,
        history: action.payload.resuilt,
        token: action.payload.tokens[action.payload.tokens.length - 1].token,
      };
    case UPDATE_PROFILE_SUCCESS:
      console.log(action);
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('idMember');
      AsyncStorage.removeItem('memberProfile');
      AsyncStorage.setItem('idMember', action.payload._id);
      AsyncStorage.setItem('token', action.payload.tokens[action.payload.tokens.length - 1].token);
      AsyncStorage.setItem(
        'memberProfile',
        JSON.stringify(action.payload));
      return {
        ...state,
        data: action.payload,
        id: action.payload._id,
        history: action.payload.resuilt,
        token: action.payload.tokens[action.payload.tokens.length - 1].token,
      };

    case SEARCH_EMAIL_SUCCESS:
      return {
        ...state,
        emailValid: action.payload.correct,
        msgEmail: action.payload.msg,
      };

    case CHECK_OTP_SUCCESS:
      return {
        ...state,
        OTPvalid: action.payload.allow,
        _idReset: action.payload._id,
      };

    case CHANGE_PASS_SUCCESS:
      return {
        ...state,
        resetPass: action.payload.Success,
      };
    default:
      return state;
  }
};
export default Reducer;
