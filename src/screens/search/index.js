import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import React, {useCallback, useState} from 'react';
import {ScrollView, StatusBar, View} from 'react-native';
import {Appbar, List, Searchbar, ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

const Search = ({navigation}) => {
  const suggestionSelector = useSelector((state) => state.suggestion);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(suggestionSelector);
  const [suggestionsCategory, setSuggestionsCategory] = useState(null);
  const [suggestionsBrand, setSuggestionsBrand] = useState(null);
  const [keyword, setKeyword] = useState('');
  const fetchData = async (q) => {
    const url = 'https://api.harnic.id/product/suggestions/';
    setLoading(true);
    await axios
      .post(
        url,
        qs.stringify({
          keyword: q,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        },
      )
      .then((res) => {
        setLoading(false);
        setSuggestions(res.data.items);
        setSuggestionsCategory(res.data.cats);
        setSuggestionsBrand(res.data.brands);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const delayedQuery = useCallback(
    _.debounce((q) => fetchData(q), 500),
    [],
  );

  const _handleChange = (e) => {
    setKeyword(e);
    delayedQuery(e);
  };

  const _handleSubmit = () => {
    navigation.push('SearchResult', {
      keyword: keyword,
      brand: null,
      category: null,
    });
  };
  return (
    <>
      <StatusBar
        translucent={false}
        barStyle="dark-content"
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <Appbar.Header style={{backgroundColor: '#eee', elevation: 0}}>
        <Searchbar
          autoFocus
          placeholder="Cari Produk"
          value={keyword}
          icon={() => <Icon name="arrow-left" size={24} />}
          onIconPress={() => navigation.goBack()}
          onChangeText={(text) => _handleChange(text)}
          onSubmitEditing={_handleSubmit}
          style={{elevation: 0, flex: 1, backgroundColor: '#eee'}}
        />
      </Appbar.Header>
      {loading ? <ProgressBar indeterminate /> : <View style={{height: 4}} />}
      <ScrollView style={{backgroundColor: '#fff'}}>
        {suggestions && suggestions.length > 0 && (
          <>
            <List.Subheader style={{backgroundColor: '#888', color: 'white'}}>
              Kata Kunci
            </List.Subheader>
            {suggestions.map((r) => (
              <List.Item
                key={r.id}
                onPress={() =>
                  navigation.push('SearchResult', {
                    keyword: r.val,
                    brand: null,
                    category: null,
                  })
                }
                title={r.val}
                style={{elevation: 5}}
                right={() => <List.Icon icon="magnify" />}
              />
            ))}
          </>
        )}
        {suggestionsCategory && suggestionsCategory.length > 0 && (
          <>
            <List.Subheader style={{backgroundColor: '#888', color: 'white'}}>
              Kategori
            </List.Subheader>
            {suggestionsCategory.map((r) => (
              <List.Item
                key={r.id}
                onPress={() =>
                  navigation.push('SearchResult', {
                    category: r.id,
                    brand: null,
                    keyword: null,
                  })
                }
                title={r.val}
                style={{elevation: 5}}
                right={() => <List.Icon icon="magnify" />}
              />
            ))}
          </>
        )}
        {suggestionsBrand && suggestionsBrand.length > 0 && (
          <>
            <List.Subheader style={{backgroundColor: '#888', color: 'white'}}>
              Brand
            </List.Subheader>
            {suggestionsBrand.map((r) => (
              <List.Item
                key={r.id}
                onPress={() =>
                  navigation.push('SearchResult', {
                    brand: r.id,
                    keyword: null,
                    category: null,
                  })
                }
                title={r.val}
                style={{elevation: 5}}
                right={() => <List.Icon icon="magnify" />}
              />
            ))}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Search;
