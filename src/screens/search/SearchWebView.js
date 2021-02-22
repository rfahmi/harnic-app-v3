import React from 'react';
import {StatusBar} from 'react-native';
import WebView from 'react-native-webview';
import HeaderBack from '../../components/HeaderBack';

const SearchWebView = ({navigation, route}) => {
  const {title, url} = route.params;
  return (
    <>
      <StatusBar
        translucent={false}
        barStyle="dark-content"
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <HeaderBack title={title} search={false} />
      <WebView
        cacheEnabled={true}
        javaScriptEnabled={true}
        startInLoadingState={true}
        source={{
          uri: url,
        }}
      />
    </>
  );
};

export default SearchWebView;
