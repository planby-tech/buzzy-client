import React from 'react';
import {StatusBar} from 'react-native';
import {MainWrapper} from '../../components/common/MainWrapper';
import GardenTabs from './GardenTabs';

const GardenTabsScreen = () => {
  return (
    <MainWrapper>
      <StatusBar barStyle="light-content" />
      <GardenTabs />
    </MainWrapper>
  );
};

export default GardenTabsScreen;
