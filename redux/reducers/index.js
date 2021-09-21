/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';
import { default as Auth} from './auth/auth';
import { default as Topic} from './topics/topic';
import { default as Rank} from './rank/rank';
const rootReducer = combineReducers({
    auth: Auth,
    topic: Topic,
    rank: Rank,
});

export default rootReducer;
