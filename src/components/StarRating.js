import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../constants/colors';

const StarRating = ({rating = 0}) => {
  const max_rating = 5;
  const unrated = Number(max_rating) - Number(rating);
  const rated_star = Array.from(Array(Number(rating)).keys());

  const unrated_star = Array.from(Array(unrated).keys());
  return (
    <View style={{flexDirection: 'row'}}>
      {rated_star.map((a, index) => {
        return (
          <Icon
            key={'rated' + index}
            name="star"
            size={16}
            color={colors.goldYellow}
          />
        );
      })}
      {unrated_star.map((a, index) => {
        return (
          <Icon
            key={'unrated' + index}
            name="star"
            size={16}
            color={colors.grayLight}
          />
        );
      })}
    </View>
  );
};

export default StarRating;
