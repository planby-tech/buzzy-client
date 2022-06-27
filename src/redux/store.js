import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import messageReducer from './slices/message';
import groupReducer from './slices/group';
import userReducer from './slices/user';
import meetingReducer from './slices/meeting';
import tagReducer from './slices/tag';
import questionReducer from './slices/question';
import postReducer from './slices/post';
import flowerReducer from './slices/flower';
import imageReducer from './slices/image';
const reducer = {
  auth: authReducer,
  group: groupReducer,
  user: userReducer,
  message: messageReducer,
  meeting: meetingReducer,
  tag: tagReducer,
  question: questionReducer,
  post: postReducer,
  flower: flowerReducer,
  image: imageReducer,
};
const store = configureStore({
  reducer: reducer,
  devTools: true,
});
export default store;
