import qs from 'qs';
import React, {memo, useState, useEffect} from 'react';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view-improved';
import Empty from '../../organism/empty';
import {api} from '../../configs/api';
import SearchResultItems from '../../organism/search/SearchResultItems';
import HeaderBackSearch from '../../components/HeaderBackSearch';

const SearchResult = ({navigation, route}) => {
  const keyword = route.params?.keyword ?? '';
  const category = route.params?.category ?? '';
  const brand = route.params?.brand ?? '';

  console.log('------------------------------');
  console.log('keyword', keyword);
  console.log('category', category);
  console.log('brand', brand);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const getData = () => {
    api
      .post(
        '/product/find/categories',
        qs.stringify({
          keyword,
          category,
          brand,
        }),
      )
      .then(res => {
        setLoading(false);
        setData(res.data.data);
      })
      .catch(err => {
        console.log(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <HeaderBackSearch />
      {data && data.length > 1 ? (
        <ScrollableTabView
          renderTabBar={() => (
            <ScrollableTabBar
              backgroundColor="rgba(255, 255, 255, 0.7)"
              activeTextColor="#1100BB"
            />
          )}>
          {data.map(i => {
            return (
              <SearchResultItems
                key={`CatTab${i.id}`}
                tabLabel={i.name}
                category={i.id}
                keyword={keyword}
                brand={brand}
              />
            );
          })}
        </ScrollableTabView>
      ) : data && data.length === 1 ? (
        data.map(i => {
          return (
            <SearchResultItems
              key={`CatTab${i.id}`}
              tabLabel={i.name}
              category={i.id}
              keyword={keyword}
              brand={brand}
            />
          );
        })
      ) : (
        !loading && (
          <Empty
            image="search_engine"
            title="Pencarian tidak ditemukan"
            caption="Periksa kata kunci anda dan coba lagi"
            actionLabel="Cari Lagi"
            action={() => navigation.replace('Search')}
          />
        )
      )}
    </>
  );
};

export default memo(SearchResult);
