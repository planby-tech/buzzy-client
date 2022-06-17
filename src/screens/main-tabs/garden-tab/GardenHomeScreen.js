import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {MainWrapper} from '../../../components/common/MainWrapper';
import {
  Body3,
  Heading4,
  Small,
} from '../../../components/design-system/FontSystem';
import {XIcon} from '../../../components/design-system/IconSystem';
import Profile6 from '../../../assets/images/Profile-6.png';
import GardenBackground from '../../../assets/images/garden-background.png';
import YellowMiddleFlower from '../../../assets/images/yellow-middle-flower.png';
import PinkTallFlower from '../../../assets/images/pink-tall-flower.png';
import BlueShortFlower from '../../../assets/images/blue-short-flower.png';
import GreenTallFlower from '../../../assets/images/green-tall-flower.png';
import YellowShortFlower from '../../../assets/images/yellow-short-flower.png';
import OrangeMiddleFlower from '../../../assets/images/orange-middle-flower.png';
import BlueTallFlower from '../../../assets/images/blue-tall-flower.png';

import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {tagging} from '../../../redux/slices/tag';

NfcManager.start();

const GardenHomeScreen = ({groupInfo}) => {
  console.log('groupInfo in GardenHomeScreen: ' + JSON.stringify(groupInfo));
  const navigation = useNavigation();

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.log('Tag found', tag.id);
      if (landmark.tagUid === tag.id) {
        dispatch(tagging({groupId: 1, tagUid: landmark.tagUid}))
          .unwrap()
          .then(res => console.log(res));
      } else {
        showMessage({
          message: '선택하신 랜드마크와 맞는 NFC 태그가 아닙니다.',
          type: 'warning',
        });
      }
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

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
                  return <Small key={idx}>{val.name}</Small>;
                }
                return <Small key={idx}>{val.name}, </Small>;
              })}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <XIcon color="white" size={24} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: '55%',
        }}>
        <Image
          source={GardenBackground}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            position: 'absolute',
            bottom: 0,
          }}>
          <Image
            source={YellowMiddleFlower}
            style={{
              width: 58,
              height: 103,
              zIndex: 2,
            }}
            resizeMode="contain"
          />
          <Image
            source={PinkTallFlower}
            style={{width: 58, height: 148, zIndex: 2}}
            resizeMode="contain"
          />
          <Image
            source={BlueShortFlower}
            style={{width: 58, height: 72}}
            resizeMode="contain"
          />
          <Image
            source={GreenTallFlower}
            style={{width: 58, height: 148}}
            resizeMode="contain"
          />
          <Image
            source={YellowShortFlower}
            style={{width: 58, height: 72}}
            resizeMode="contain"
          />
          <Image
            source={OrangeMiddleFlower}
            style={{width: 58, height: 103}}
            resizeMode="contain"
          />
          <Image
            source={BlueTallFlower}
            style={{width: 58, height: 130}}
            resizeMode="contain"
          />
        </View>
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
    </MainWrapper>
  );
};

const styles = StyleSheet.create({});

export default GardenHomeScreen;
