import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {MainWrapper} from '../../../components/common/MainWrapper';
import MeetingListScreen from './MeetingListScreen';
import PostScreen from './PostScreen';

const MeetingListStack = createNativeStackNavigator();

const MeetingListNavigator = ({groupInfo}) => {
  return (
    <MainWrapper>
      <MeetingListStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="MeetingList">
        <MeetingListStack.Screen
          children={() => {
            return <MeetingListScreen groupInfo={groupInfo} />;
          }}
          name="MeetingList"
        />
        <MeetingListStack.Screen component={PostScreen} name="Post" />
      </MeetingListStack.Navigator>
    </MainWrapper>
  );
};

export default MeetingListNavigator;
