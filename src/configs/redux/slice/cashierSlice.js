// cashierSlice.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import QueryString from 'qs';
import {api, app_version} from '../../api';

export const findProductWithBarcode = createAsyncThunk(
  'cashier/findProductWithBarcode',
  async ({barcode}, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      console.log('BARCODE', barcode);
      const res1 = await api.get(`/product/barcode/${barcode}`);
      console.log('RES', res1?.data);
      const itemId = res1?.data?.data?.itemmst;
      console.log('ITEMID', itemId);
      if (itemId) {
        const res2 = await api.post(
          `/user/${user_data.user_id}/cart`,
          QueryString.stringify({
            item_id: itemId,
            qty: 1,
            note: '',
            app_version,
            is_cashier: 1,
          }),
          {
            headers: {
              Authorization: 'Bearer ' + api_token,
            },
          },
        );
        return res2;
      } else {
        return rejectWithValue('Barcode Tidak Dikenal');
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const getCartItems = createAsyncThunk(
  'cashier/getCartItems',
  async (_, {rejectWithValue}) => {
    console.log('GET CART ITEMS');
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
      return rejectWithValue(error.response.data.message);
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
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  'cashier/deleteCartItem',
  async ({itemid}, {rejectWithValue, getState}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));

    try {
      const response = await api.delete(
        `/user/${user_data.user_id}/cart/${itemid}`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      console.log('DELETE', response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
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
        QueryString.stringify({
          shipping_id: 1,
          expedition_id: '18',
          type_id: 2,
          time_id: 1,
          is_cashier: '1',
        }),
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      if (!response?.data?.success) {
        return rejectWithValue(response?.data?.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const getTrxData = createAsyncThunk(
  'cashier/getTrxData',
  async ({trxno}, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      const response = await api.get(
        `/user/${user_data.user_id}/transaction/${trxno}`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const getTrxList = createAsyncThunk(
  'cashier/getTrxList',
  async ({page, limit}, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      const response = await api.get(
        `/user/${user_data.user_id}/transaction/?page=${page}&limit=${limit}&is_cashier=1`,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const uploadPaymentPhoto = createAsyncThunk(
  'cashier/uploadPaymentPhoto',
  async ({trxno, formData}, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      const response = await api.post(
        `/user/${user_data.user_id}/transaction/${trxno}/payment/upload`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const voidTrx = createAsyncThunk(
  'cashier/voidTrx',
  async ({trxno}, {rejectWithValue}) => {
    const api_token = await AsyncStorage.getItem('api_token');
    const user_data = JSON.parse(await AsyncStorage.getItem('user_data'));
    try {
      const response = await api.post(
        `/user/${user_data.user_id}/transaction/${trxno}/void`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + api_token,
          },
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const cashierSlice = createSlice({
  name: 'cashier',
  initialState: {
    trx: null,
    trxList: [],
    cart: [],
    error: null,
    loading: false,
  },
  reducers: {
    resetTrxList: state => {
      state.trxList = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(findProductWithBarcode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findProductWithBarcode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(findProductWithBarcode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getCartItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        console.log('GET CART ITEMS', 'FULLFILLED');
        state.cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCartItems.rejected, (state, action) => {
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

    builder
      .addCase(deleteCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(submitCart.pending, state => {
        state.trx = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCart.fulfilled, (state, action) => {
        state.trx = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(submitCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getTrxData.pending, state => {
        state.trx = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrxData.fulfilled, (state, action) => {
        state.trx = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getTrxData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getTrxList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrxList.fulfilled, (state, action) => {
        state.trxList = state.trxList.concat(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(getTrxList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(voidTrx.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voidTrx.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(voidTrx.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {resetTrxList} = cashierSlice.actions;
export default cashierSlice.reducer;
