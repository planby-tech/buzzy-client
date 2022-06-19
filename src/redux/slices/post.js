import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import postService from '../../services/post.service';

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({groupId, meetingId, userId, questionAnswers}, thunkAPI) => {
    try {
      const response = await postService.createPost(
        groupId,
        meetingId,
        userId,
        questionAnswers,
      );
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);

const initialState = {};
const postSlice = createSlice({
  name: 'post',
  initialState,
  extraReducers: {
    // [createMeeting.fulfilled]: (state, action) => {
    //   state.groupArray = action.payload.groupArray;
    // },
    // [findByUser.rejected]: (state, action) => {
    //   state.groupArray = null;
    // },
  },
});
const {reducer} = postSlice;
export default reducer;
