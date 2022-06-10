import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import meetingService from '../../services/meeting.service';

export const createMeeting = createAsyncThunk(
  'meeting/create',
  async (
    {groupId, title, start, end, allDay, places, users, activities},
    thunkAPI,
  ) => {
    try {
      const response = await meetingService.createMeeting(
        groupId,
        title,
        start,
        end,
        allDay,
        places,
        users,
        activities,
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
const meetingSlice = createSlice({
  name: 'meeting',
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
const {reducer} = meetingSlice;
export default reducer;
