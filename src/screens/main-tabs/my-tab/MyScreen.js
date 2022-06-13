import React from 'react';
import {Text, View} from 'react-native';
import {MainWrapper} from '../../../components/common/MainWrapper';

const MyScreen = () => {
  return (
    <MainWrapper edgeSpacing={16}>
      <Text style={{color: '#fff', fontSize: 40}}>My</Text>
    </MainWrapper>
  );
};

export default MyScreen;
