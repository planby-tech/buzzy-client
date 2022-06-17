import React from 'react';
import {StatusBar} from 'react-native';
import {MainWrapper} from '../../components/common/MainWrapper';
import GardenTabs from './GardenTabs';

const GardenTabsScreen = ({route}) => {
  return (
    <MainWrapper>
      <StatusBar barStyle="light-content" hidden />
      <GardenTabs groupInfo={route.params} />
    </MainWrapper>
  );
};

export default GardenTabsScreen;
