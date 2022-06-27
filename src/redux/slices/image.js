import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import imageService from '../../services/image.service';

export const uploadPostImage = createAsyncThunk(
  'photo/uploadPostImage',
  async ({postId, photoData}, thunkAPI) => {
    try {
      const response = await imageService.uploadPostImage(postId, photoData);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response;
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
const imageSlice = createSlice({
  name: 'image',
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
const {reducer} = imageSlice;
export default reducer;
