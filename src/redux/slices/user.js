import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from './message';
import userService from '../../services/user.service';

export const findByUser = createAsyncThunk(
  'users/findGroups',
  async (userId, thunkAPI) => {
    try {
      // console.log('userId in findByUser in user.js: ' + userId);
      const data = await userService.findByUser(userId);
      // console.log('data in findByUser in user.js: ' + JSON.stringify(data));
      if (data) return {groupArray: data};
      return null;
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

const initialState = {groupArray: null};
const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: {
    [findByUser.fulfilled]: (state, action) => {
      state.groupArray = action.payload.groupArray;
    },
    [findByUser.rejected]: (state, action) => {
      state.groupArray = null;
    },
  },
});
const {reducer} = userSlice;
export default reducer;
