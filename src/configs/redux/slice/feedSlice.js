// feedSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../api';

export const fetchFeedVideo = createAsyncThunk(
  'feed/videos',
  async ({page, limit}, {rejectWithValue}) => {
    try {
      // console.log({page, limit});
      const response = await api.get('/feed/videos/', {
        params: {page, limit},
      });
      // console.log('response', response);
      return response.data?.data;
    } catch (error) {
      // console.log('error', error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    videos: [],
    error: null,
    loading: false,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFeedVideo.pending, (state, {meta}) => {
        if (meta.arg.page === 1) {
          console.log('reset');
          state.videos = [];
        }
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedVideo.fulfilled, (state, action) => {
        state.videos = state.videos.concat(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFeedVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedSlice.reducer;
