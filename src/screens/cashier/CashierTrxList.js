import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {List, useTheme} from 'react-native-paper';
import {
  getTrxData,
  getTrxList,
  resetTrxList,
} from '../../configs/redux/slice/cashierSlice';
import {useIsFocused} from '@react-navigation/native';

const PAGE_SIZE = 10; // Number of items to fetch per page

const CashierTrxList = ({navigation}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = useState(1); // Current page
  const {trxList, loading} = useSelector(state => state.cashier);

  const hasMoreData = trxList.length % PAGE_SIZE === 0;

  useEffect(() => {
    // Initial load when the component mounts
    dispatch(resetTrxList());
    dispatch(getTrxList({page: 1, limit: PAGE_SIZE}));
  }, [isFocused]);

  const loadMoreData = () => {
    // Load more data when scrolling to the end if there are more pages
    if (!loading && hasMoreData && isFocused) {
      dispatch(getTrxList({page: page + 1, limit: PAGE_SIZE}));
      setPage(page + 1);
    }
  };
  const handleClickItem = trxno => {
    dispatch(getTrxData({trxno}));
    navigation.push('CashierReceipt');
  };

  const renderItem = ({item}) => {
    return (
      <List.Item
        title={item.trxno_wl}
        description={item.orderdate}
        left={() => <List.Icon icon="folder" />}
        right={() =>
          item.status === 'Dikirim' ? (
            <List.Icon icon="clock" color="orange" />
          ) : item.status === 'Diterima' ? (
            <List.Icon icon="check" color="green" />
          ) : (
            <List.Icon icon="close" color="red" />
          )
        }
        onPress={() => handleClickItem(item.trxno)}
      />
    );
  };

  const renderFooter = () => {
    // Display a loading indicator at the end of the list while loading more data
    return loading ? (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator animating color={theme.colors.primary} />
      </View>
    ) : null;
  };

  return (
    <FlatList
      data={trxList}
      renderItem={renderItem}
      keyExtractor={item => item?.salesid}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
    />
  );
};

export default CashierTrxList;
