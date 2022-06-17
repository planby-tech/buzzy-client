import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import messageReducer from './slices/message';
import groupReducer from './slices/group';
import userReducer from './slices/user';
import meetingReducer from './slices/meeting';
import tagReducer from './slices/tag';
import questionReducer from './slices/question';
const reducer = {
  auth: authReducer,
  group: groupReducer,
  user: userReducer,
  message: messageReducer,
  meeting: meetingReducer,
  tag: tagReducer,
  question: questionReducer,
};
const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export default store;
