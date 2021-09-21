/* eslint-disable prettier/prettier */
import {
  ALL_MEMBER_SUCCESS,
  ENJECT_MEMBER_SUCCESS,
} from '../../types/member/member';
const initData = {
  data: [],
};

var findID = (dataf, id) => {
  var resuilt = -1;
  dataf.forEach((data, index) => {
    if (data._id === id) {
      resuilt = index;
    }
  });
  return resuilt;
};
const Reducer = (state = initData, action) => {
  switch (action.type) {
    case ALL_MEMBER_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case ENJECT_MEMBER_SUCCESS:
      var index = -1;
      index = findID(state.data,action.payload._id);
      if (index !== -1)
      {
        state.data[index] = action.payload;
      }
      return {
        ...state,
        data: [...state.data],
      };
    default:
      return state;
  }
};
// eslint-disable-next-line eol-last
export default Reducer;
