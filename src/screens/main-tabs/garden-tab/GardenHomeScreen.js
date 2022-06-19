import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {MainWrapper} from '../../../components/common/MainWrapper';
import Modal from 'react-native-modal';
import {
  Body2,
  Body3,
  Heading2,
  Heading4,
  Small,
} from '../../../components/design-system/FontSystem';
import {XIcon} from '../../../components/design-system/IconSystem';
import NfcTag from '../../../assets/images/nfc-tag.png';
import Profile6 from '../../../assets/images/Profile-6.png';
import GardenBackground from '../../../assets/images/garden-background.png';
import YellowMiddleFlower from '../../../assets/images/yellow-middle-flower.png';
import PinkTallFlower from '../../../assets/images/pink-tall-flower.png';
import BlueShortFlower from '../../../assets/images/blue-short-flower.png';
import GreenTallFlower from '../../../assets/images/green-tall-flower.png';
import YellowShortFlower from '../../../assets/images/yellow-short-flower.png';
import OrangeMiddleFlower from '../../../assets/images/orange-middle-flower.png';
import BlueTallFlower from '../../../assets/images/blue-tall-flower.png';

import SecondaryButton from '../../../components/common/SecondaryButton';

import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {tagging} from '../../../redux/slices/tag';

NfcManager.start();

const GardenHomeScreen = ({groupInfo}) => {
  console.log('groupInfo in GardenHomeScreen: ' + JSON.stringify(groupInfo));
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.log('Tag found', tag.id);
      dispatch(tagging({groupId: 1, tagUid: tag.id}))
        .unwrap()
        .then(res => console.log(res));
    } catch (ex) {
      // console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  const handleNFCTag = () => {
    readNdef();
    setModalVisible(true);
  };

  const handleModalClose = () => {
    NfcManager.cancelTechnologyRequest();
    setModalVisible(false);
  };
  return (
    <MainWrapper>
      <View
        style={{
          flexDirection: 'row',
          marginTop: '15%',
          padding: 16,
          backgroundColor: '#111214',
          height: '12%',
          borderRadius: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 16,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={Profile6}
            resizeMode="cover"
            style={{width: 40, height: 40, marginRight: 8, borderRadius: 8}}
          />
          <View>
            <Heading4>{groupInfo.name} 가든</Heading4>
            <View style={{flexDirection: 'row'}}>
              {groupInfo.users.map((val, idx) => {
                if (idx === groupInfo.users.length - 1) {
                  return (
                    <Small style={{color: '#9298A0'}} key={idx}>
                      {val.name}
                    </Small>
                  );
                }
                return (
                  <Small style={{color: '#9298A0'}} key={idx}>
                    {val.name},{' '}
                  </Small>
                );
              })}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 28,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#fff',
            borderRadius: 8,
          }}
          onPress={handleNFCTag}>
          <Text style={{fontFamily: 'SUIT-Bold', fontSize: 8, color: '#fff'}}>
            NFC
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: '55%',
        }}>
        <Image
          source={GardenBackground}
          style={{width: '100%', height: '100%', marginTop: 10}}
          resizeMode="cover"
        />
        {/* <FlatList /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            position: 'absolute',
            bottom: 0,
          }}></View>
      </View>
      <View
        style={{
          backgroundColor: '#131415',
          height: '35%',
          paddingHorizontal: 20,
          paddingTop: 26,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Heading4>모든 꽃</Heading4>
          <TouchableOpacity>
            <Body3 style={{color: '#40BB91'}}>모두 보기</Body3>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={modalVisible}
        onModalHide={handleModalClose}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
        onBackButtonPress={handleModalClose}
        swipeDirection="down"
        style={{margin: 0, padding: 0}}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            alignItems: 'center',
            width: '100%',
            height: '50%',
            backgroundColor: '#18191B',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View
            style={{
              backgroundColor: '#979797',
              width: 48,
              height: 5,
              borderRadius: 3,
              marginTop: 8,
            }}
          />
          <Heading2 style={{marginTop: 20}}>스캔 준비 완료</Heading2>
          <Image
            source={NfcTag}
            style={{width: 120, height: 120, marginTop: 32}}
          />
          <Body2 style={{marginTop: 32}}>NFC 스티커를 조회 중입니다.</Body2>
          <SecondaryButton
            title="취소하기"
            onPress={handleModalClose}
            style={{borderWidth: 0, width: 300, marginTop: 32}}
          />
        </View>
      </Modal>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({});

export default GardenHomeScreen;
