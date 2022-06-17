import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import questionService from '../../services/question.service';

export const generateQuestion = createAsyncThunk(
  'question/generateQuestion',
  async ({meetingId, userId}, thunkAPI) => {
    try {
      const response = await questionService.generateQuestion(
        meetingId,
        userId,
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
const questionSlice = createSlice({
  name: 'question',
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
const {reducer} = questionSlice;
export default reducer;
