// import React from 'react';
// import {Text, View} from 'react-native';
// import {MainWrapper} from '../../../components/common/MainWrapper';

// const MyScreen = () => {
//   return (
//     <MainWrapper edgeSpacing={16}>
//       <Text style={{color: '#fff', fontSize: 40}}>My</Text>
//     </MainWrapper>
//   );
// };

// export default MyScreen;

import React from 'react';
import {View, Image} from 'react-native';

import NotPrepared from '../../../assets/images/not-prepared.png';
import {MainWrapper} from '../../../components/common/MainWrapper';
import {Body3, Heading3} from '../../../components/design-system/FontSystem';

const MyScreen = () => {
  return (
    <MainWrapper edgeSpacing={16}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            height: 450,
            backgroundColor: '#202225',
            borderRadius: 20,
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={NotPrepared}
              style={{width: 78, height: 78}}
              resizeMode="contain"
            />
            <Heading3 style={{marginTop: 30}}>
              현재 채팅 페이지는{' '}
              <Heading3 style={{color: '#59f9c1'}}>준비중</Heading3>입니다.
            </Heading3>
            <Body3 style={{marginTop: 12}}>
              하단의 좌측 두 가지 탭만 사용하실 수 있습니다.
            </Body3>
            <Body3>현재 페이지가 궁금하시다면 리플렛을 참고해 주세요.</Body3>
            <Body3>감사합니다:-{')'}</Body3>
          </View>
        </View>
      </View>
    </MainWrapper>
  );
};

export default MyScreen;
