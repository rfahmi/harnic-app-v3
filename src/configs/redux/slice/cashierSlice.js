// cashierSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QueryString from 'qs';

export const findProductWithBarcode = createAsyncThunk(
  'cashier/findProductWithBarcode',
  async (barcode, {rejectWithValue}) => {
    try {
      const response = await api.get(`/product/barcode/${barcode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getCartItems = createAsyncThunk(
  'cashier/getCartItems',
  async (_, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      const response = await api.get(
        `/user/${user_data.user_id}/cart?is_cashier=1`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      return response.data.data?.products;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCartItemQuantity = createAsyncThunk(
  'cashier/updateCartItemQuantity',
  async ({itemid, qty}, {rejectWithValue, getState}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    try {
      const currentCart = getState().cashier.cart;
      const currentItemState = currentCart.filter(a => (a.itemid = itemid));

      console.log('CURRENT', itemid, qty, currentItemState[0]);
      const response = await api.put(
        `/user/${user_data.user_id}/cart/${itemid}`,
        QueryString.stringify({qty, note: null, is_cashier: 1}),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      console.log('UPDATE', response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const submitCart = createAsyncThunk(
  'cashier/submitCart',
  async (_, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      const response = await api.post(
        `/user/${user_data.user_id}/transaction`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const cashierSlice = createSlice({
  name: 'cashier',
  initialState: {
    findItem: null,
    cart: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(findProductWithBarcode.pending, state => {
        state.findItem = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(findProductWithBarcode.fulfilled, (state, action) => {
        state.findItem = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(findProductWithBarcode.rejected, (state, action) => {
        state.findItem = false;
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getCartItems.pending, state => {
        state.cart = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.cart = [];
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateCartItemQuantity.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cashierSlice.reducer;
