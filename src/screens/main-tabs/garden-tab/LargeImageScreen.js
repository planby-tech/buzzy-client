import React from 'react';
import {View, Image} from 'react-native';
import {MainWrapper} from '../../../components/common/MainWrapper';

const LargeImageScreen = ({navigation, route}) => {
  const path = route.params.path;
  return (
    <MainWrapper style={{justifyContent: 'center'}}>
      <Image source={{uri: path}} style={{flex: 1}} resizeMode="contain" />
    </MainWrapper>
  );
};

export default LargeImageScreen;
