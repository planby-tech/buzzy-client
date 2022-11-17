import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Button from './common/SubmitButton';
import {Heading3, Heading5, Tiny} from './design-system/FontSystem';
import {ClockIcon, MenuDotsIcon, PersonIcon} from './design-system/IconSystem';
import NoFlower from '../assets/images/no-flower.png';
import {useSelector} from 'react-redux';

import {imagePath} from './imagePath';

export default MeetingBlock = ({groupInfo, meetingInfo, navigation}) => {
  const {user} = useSelector(state => state.auth);
  const userId = user.user?.id;

  const handleNavigateToPost = () => {
    navigation.navigate('Post', {meetingInfo, userId: userId, groupInfo});
  };
  return (
    <View
      style={{
        marginBottom: 16,
        backgroundColor: '#202225',
        borderRadius: 12,
        padding: 12,
      }}>
      <View style={{flexDirection: 'row', marginBottom: 8}}>
        <View style={{flex: 1}}>
          <Tiny>{groupInfo.name}</Tiny>
          <Heading3 style={{marginTop: 4}}>{meetingInfo.title}</Heading3>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <PersonIcon size={16} />
            <Tiny>
              {meetingInfo.users.map((val, idx) => {
                if (meetingInfo.users.length === idx + 1) return ` ${val.name}`;
                return ` ${val.name},`;
              })}
            </Tiny>
          </View>
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <ClockIcon size={16} />
            {Object.keys(meetingInfo.duration).length === 0 ? (
              meetingInfo.allDay ? (
                <Tiny> 하루종일</Tiny>
              ) : (
                <Tiny>
                  {' ' + meetingInfo.start.split('/')[1]}부터 ~
                  {' ' + meetingInfo.end.split('/')[1]}까지
                </Tiny>
              )
            ) : (
              <Tiny> {meetingInfo.start.split('/')[1]}부터 ~ </Tiny>
            )}
          </View>
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          {meetingInfo.flowerId ? (
            <Image
              source={imagePath[meetingInfo.flowerId]}
              style={{width: 52, height: 52, marginRight: 30, bottom: 5}}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={NoFlower}
              style={{width: 60, height: 60, marginRight: 30, bottom: 5}}
              resizeMode="contain"
            />
          )}
        </View>
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 4,
          top: 16,
          width: 50,
          height: 50,
          alignItems: 'flex-end',
        }}>
        <MenuDotsIcon size={32} />
      </TouchableOpacity>
      {meetingInfo.flowerId ? (
        <View
          style={{
            backgroundColor: '#111',
            height: 40,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Heading5>기록 완료!</Heading5>
        </View>
      ) : (
        <Button
          title="기록하기"
          onPress={handleNavigateToPost}
          style={{
            height: 40,
            borderRadius: 8,
          }}
        />
      )}
    </View>
  );
};
