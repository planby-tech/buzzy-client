import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import flowerService from '../../services/flower.service';

export const findPosts = createAsyncThunk(
  'flower/findPosts',
  async ({groupId, flowerId}, thunkAPI) => {
    try {
      const response = await flowerService.findPosts(groupId, flowerId);
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
const flowerSlice = createSlice({
  name: 'flower',
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
const {reducer} = flowerSlice;
export default reducer;
