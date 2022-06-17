import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import {MainWrapper} from '../../../components/common/MainWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import {Body3, Heading3} from '../../../components/design-system/FontSystem';

import VisualDesign from '../../../assets/images/visual-design.png';
import EwhaLogo from '../../../assets/images/ewha-logo.png';
import Button from '../../../components/common/SubmitButton';
import {generateQuestion} from '../../../redux/slices/question';
import {useDispatch} from 'react-redux';

const PostScreen = ({navigation, route}) => {
  const meetingId = 14;
  const userId = 14;

  const groupInfo = route.params.groupInfo;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(generateQuestion({meetingId, userId}))
      .unwrap()
      .then(questionArray => {
        console.log(questionArray);
      });
  }, []);
  return (
    <MainWrapper edgeSpacing={32}>
      <ScreenHeader title={`이화여자대학교의 기록`} navigation={navigation} />
      <View style={{justifyContent: 'center', height: '90%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={VisualDesign}
            style={{width: 33, height: 38}}
            resizeMode="contain"
          />
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: '#fff',
              marginHorizontal: 11,
            }}
          />
          <Image
            source={EwhaLogo}
            style={{width: 33, height: 38}}
            resizeMode="contain"
          />
        </View>
        <View style={{marginTop: 20}}>
          <Heading3>해당 기록하기는</Heading3>
          <Heading3>2022 이화여자대학교 졸업전시에서</Heading3>
          <Heading3>설문으로 대체됩니다.</Heading3>
        </View>
        <View style={{marginTop: 16}}>
          <Body3>본 설문은 Buzzy 앱 사용자 대상으로 간단한 의견을</Body3>
          <Body3>알아보기 위해 작성되었습니다. 본 조사는 6월 32일부</Body3>
          <Body3>터 26일까지, 6일동안 받을 예정입니다. 작성해 주신</Body3>
          <Body3>내용의 일부는 방명록으로 사용되며 설문 내용을 토대</Body3>
          <Body3>로 Buzzy의 사용성 향상에 사용될 예정입니다.</Body3>
          <Body3>감사합니다.</Body3>
        </View>
        <Button
          title="설문 시작하기"
          style={{marginTop: '20%', width: '50%'}}
        />
      </View>
    </MainWrapper>
  );
};

export default PostScreen;
