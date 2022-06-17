import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {MainWrapper} from '../../../components/common/MainWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import {
  Body3,
  Heading5,
  Small,
} from '../../../components/design-system/FontSystem';
import Button from '../../../components/common/SubmitButton';

const InvitationCodePublishScreen = ({navigation, route}) => {
  const [copiedCode, setCopiedCode] = useState('');
  const groupCode = route.params.groupCode;
  // const groupCode = 'ASDFGH';
  console.log(groupCode);

  const copyGroupCode = groupCode => {
    Clipboard.setString(groupCode);
    setCopiedCode(groupCode);
  };

  const handleNavigate = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'GardenList'}],
    });
  };

  return (
    <MainWrapper edgeSpacing={16}>
      <View style={{flex: 1}}>
        <ScreenHeader title="친구 초대하기" />
        <View style={{alignItems: 'center'}}>
          <Body3 style={{marginTop: 20}}>가든으로 친구를 초대해서</Body3>
          <Body3>함께 소중한 추억을 쌓아봐요!</Body3>
        </View>
        <Heading5 style={{marginTop: 36}}>가든 입장 코드</Heading5>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#202225',
            borderRadius: 8,
            marginTop: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
          <Body3 style={{color: '#ccc'}}>{groupCode}</Body3>
          <TouchableOpacity onPress={() => copyGroupCode(groupCode)}>
            <Body3 style={{color: '#CFF377'}}>복사</Body3>
          </TouchableOpacity>
        </View>
        <Text style={{marginTop: 12}}>
          {copiedCode && (
            <Small style={{color: '#CFF377'}}>
              가든 입장 코드가 복사되었습니다.
            </Small>
          )}
        </Text>
      </View>
      <Button title="완료" onPress={handleNavigate} />
    </MainWrapper>
  );
};

export default InvitationCodePublishScreen;
