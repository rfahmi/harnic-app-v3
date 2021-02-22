import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Divider, List} from 'react-native-paper';
import {useSelector} from 'react-redux';
import ProductCardBuyButton from '../../components/ProductCardBuyButton';
import {colors} from '../../constants/colors';
import {currencyFormat} from '../../utils/formatter';

const ShopListItem = ({item, deleteShoppingList}) => {
  const auth = useSelector((state) => state.auth);
  return (
    <>
      <List.Item
        title={item.online_name}
        titleStyle={{fontSize: 12}}
        titleNumberOfLines={2}
        description={`Rp${currencyFormat(
          item[auth.priceType] || item.sellprice,
        )}`}
        descriptionStyle={{
          flex: 1,
          fontSize: 14,
          fontWeight: 'bold',
          color: 'orange',
        }}
        style={{elevation: 5}}
        left={() => (
          <View
            style={{
              width: 72,
              aspectRatio: 1 / 1,
              elevation: 1,
            }}>
            <FastImage
              source={{uri: item.picture}}
              style={{flex: 1, backgroundColor: '#eee', borderRadius: 1}}
            />
          </View>
        )}
        right={() => (
          <View style={{justifyContent: 'center'}}>
            <ProductCardBuyButton
              id={item.itemid}
              maxOrder={item.max_order}
              containerStyle={{
                width: 100,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              buttonStyle={{
                borderRadius: 6,
                flex: 1,
              }}
            />
            <Button
              mode="contained"
              icon="plus"
              color={colors.red}
              // contentStyle={{padding: 1, height: 28}}
              // labelStyle={{fontSize: 12}}
              style={{marginTop: 4}}
              uppercase={false}
              onPress={() => deleteShoppingList(item.itemid)}>
              Hapus
            </Button>
          </View>
        )}
      />
      <Divider />
    </>
  );
};

export default ShopListItem;
