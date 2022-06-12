import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import tagService from '../../services/tag.service';

export const tagging = createAsyncThunk(
  'tag/tagging',
  async ({groupId, tagUid}, thunkAPI) => {
    try {
      const response = await tagService.tagging(groupId, tagUid);
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
const tagSlice = createSlice({
  name: 'tag',
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
const {reducer} = tagSlice;
export default reducer;
