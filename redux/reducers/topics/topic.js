/* eslint-disable prettier/prettier */

import { GET_TOPIC_SUCCESS } from '../../types/topics/topic';
const initData = {
    data: [],
    };
  const Reducer = (state = initData, action) => {
      switch (action.type) {
        case GET_TOPIC_SUCCESS:
          return {
            ...state,
            data: action.payload,
          };
        default:
          return state;
      }
    };
    // eslint-disable-next-line eol-last
    export default Reducer;