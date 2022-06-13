import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {MainWrapper} from '../../components/common/MainWrapper';
import {Body3, Heading1} from '../../components/design-system/FontSystem';
import LandingGardener from '../../assets/images/landing-gardener.png';
import Button from '../../components/common/SubmitButton';
import SecondaryButton from '../../components/common/SecondaryButton';

const LandingScreen = ({navigation, route}) => {
  const {name} = route.params;

  const handleNavigateToCreateGroup = () => {
    navigation.navigate('CreateGroup'); // CreateGroup 따로 만들어서 거기로 가도록 수정해야 함.
  };

  const handleNavigateToJoinGroup = () => {
    navigation.navigate('JoinGroup'); // JoinGroup 따로 만들어서 거기로 가도록 수정해야 함.
  };

  return (
    <MainWrapper style={styles.mainWrapper} edgeSpacing={16}>
      <Heading1>{name}님,</Heading1>
      <Heading1>환영합니다!</Heading1>
      <Body3 style={{marginTop: 12}}>
        이제 가든을 통해 가족, 친구, 연인들과
      </Body3>
      <Body3>추억을 만들어 보세요.</Body3>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Image
          style={{width: 200, height: 250, marginRight: 33}}
          resizeMode="contain"
          source={LandingGardener}
        />
      </View>
      <Button title="가든 생성하기" onPress={handleNavigateToCreateGroup} />
      <SecondaryButton
        title="초대코드로 가든 입장하기"
        onPress={handleNavigateToJoinGroup}
        style={{marginTop: 20}}
      />
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    justifyContent: 'center',
  },
});

export default LandingScreen;
