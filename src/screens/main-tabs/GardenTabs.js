// import MeetingListScreen from './meeting-list-tab/MeetingListScreen';
import MapScreen from './map-tab/MapScreen';
import MyScreen from './my-tab/MyScreen';

import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {GREEN_COLOR} from '../../common/colors';
import GardenHomeScreen from './garden-tab/GardenHomeScreen';
import {
  FlowerIcon,
  CalendarIcon,
  MapIcon,
  MessageIcon,
} from '../../components/design-system/IconSystem';
import MeetingListScreen from './meeting-list-tab/MeetingListScreen';

const GardenTab = createMaterialBottomTabNavigator();

const GardenTabs = ({groupInfo}) => {
  const ICON_SIZE = 26;
  return (
    <GardenTab.Navigator
      initialRouteName="GardenHome"
      barStyle={{
        backgroundColor: '#202225',
        height: 70,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 20,
        paddingHorizontal: 16,
      }}
      screenOptions={{tabBarPressColor: 'transparent'}}
      activeColor="#86FD98"
      inactiveColor="#fff"
      labeled={false}>
      <GardenTab.Screen
        name="GardenHome"
        children={() => {
          return <GardenHomeScreen groupInfo={groupInfo} />;
        }}
        options={{
          tabBarLabel: '정원',
          tabBarIcon: ({color}) => (
            <FlowerIcon color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <GardenTab.Screen
        name="MeetingList"
        children={() => {
          return <MeetingListScreen groupInfo={groupInfo} />;
        }}
        options={{
          tabBarLabel: '약속 리스트',
          tabBarIcon: ({color}) => (
            <CalendarIcon color={color} size={ICON_SIZE} />
          ),
        }}
      />
      <GardenTab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: '지도',
          tabBarIcon: ({color}) => <MapIcon color={color} size={ICON_SIZE} />,
        }}
      />
      <GardenTab.Screen
        name="My"
        component={MyScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({color}) => (
            <MessageIcon color={color} size={ICON_SIZE} />
          ),
        }}
      />
    </GardenTab.Navigator>
  );
};

export default GardenTabs;
