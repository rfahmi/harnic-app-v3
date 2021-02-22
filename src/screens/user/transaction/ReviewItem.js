import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, List, Button} from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import {colors} from '../../../constants/colors';

const ReviewItem = ({item, send}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(item.comment_body);
  const [show, setShow] = useState(true);
  return (
    <>
      {show && (
        <>
          <List.Item
            title={item.online_name}
            titleStyle={{fontSize: 12}}
            titleNumberOfLines={2}
            description={
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 8,
                }}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                    }}>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      starSize={22}
                      starStyle={{color: colors.goldYellow}}
                      rating={rating}
                      selectedStar={(n) => setRating(n)}
                    />
                  </View>
                  <View>
                    <TextInput
                      value={comment}
                      mode="outlined"
                      multiline
                      numberOfLines={3}
                      placeholder="Bagaimana menurut anda produk ini?"
                      style={{
                        borderRadius: 8,
                        marginVertical: 4,
                        backgroundColor: colors.grayLight,
                        width: 200,
                      }}
                      onChangeText={(e) => setComment(e)}
                    />
                  </View>
                </View>
              </View>
            }
            left={() => (
              <View style={{justifyContent: 'center'}}>
                <View
                  style={{
                    width: 72,
                    aspectRatio: 1 / 1,
                    elevation: 1,
                  }}>
                  <FastImage
                    source={{uri: item.picture}}
                    style={{
                      flex: 1,
                      backgroundColor: '#eee',
                      borderRadius: 1,
                    }}
                  />
                </View>
              </View>
            )}
            right={() => (
              <Button
                mode="contained"
                onPress={() => {
                  send(item, rating, comment);
                  setShow(false);
                }}
                style={{justifyContent: 'center'}}
                contentStyle={{alignItems: 'center'}}>
                OK
              </Button>
            )}
          />
          <Divider />
        </>
      )}
    </>
  );
};

export default ReviewItem;
