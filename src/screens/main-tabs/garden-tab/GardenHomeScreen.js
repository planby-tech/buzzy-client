import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
} from 'react-native';
import {MainWrapper} from '../../../components/common/MainWrapper';
import Modal from 'react-native-modal';
import {
  Body2,
  Body3,
  Heading2,
  Heading3,
  Heading4,
  Small,
} from '../../../components/design-system/FontSystem';
import {XIcon} from '../../../components/design-system/IconSystem';
import NfcTag from '../../../assets/images/nfc-tag.png';
import Profile1 from '../../../assets/images/Profile-1.png';
import GardenBackground from '../../../assets/images/garden-background.png';

import {
  gardenFlowerImagePath,
  gardenLandmarkImagePath,
  postFlowerImagePath,
} from './imagePath';

import SecondaryButton from '../../../components/common/SecondaryButton';

import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {tagging} from '../../../redux/slices/tag';
import {useDispatch, useSelector} from 'react-redux';
import {findItems} from '../../../redux/slices/group';
import {findPosts} from '../../../redux/slices/flower';
import FlowerModal from '../../../components/FlowerModal';
import {
  NEUTRAL_700,
  NEUTRAL_850,
  NEUTRAL_950,
  PRIMARY_500,
} from '../../../components/design-system/ColorSystem';
import Button from '../../../components/common/SubmitButton';
import {showMessage} from 'react-native-flash-message';

NfcManager.start();

const GardenHomeScreen = ({groupInfo}) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showMessage({
          message: '정원에 머물러 주세요!',
          type: 'success',
        });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  const {user} = useSelector(state => state.auth);
  const userId = user.user.id;
  const groupId = groupInfo.id;
  console.log('groupInfo in GardenHomeScreen: ' + JSON.stringify(groupInfo));
  const navigation = useNavigation();

  const [selectedFlowerId, setSelectedFlowerId] = useState(null);

  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [landmarkInfo, setLandmarkInfo] = useState(null);

  const [viewType, setViewType] = useState('flower');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [itemList, setItemList] = useState([]);
  const [flowerList, setFlowerList] = useState([]);
  const [landmarkList, setLandmarkList] = useState([]);

  const [itemRef, setItemRef] = useState(null);

  useEffect(() => {
    dispatch(findItems({userId, groupId}))
      .unwrap()
      .then(res => {
        console.log('res in GardenHomeScreen: ', res);
        // res.push({flowerId: 1});
        // res.push({flowerId: 2});
        // res.push({flowerId: 3});
        // res.push({flowerId: 4});
        // res.push({flowerId: 5});
        // res.push({flowerId: 6});
        // res.push({flowerId: 7});
        // res.push({flowerId: 8});
        // res.push({flowerId: 9});
        // res.push({flowerId: 10});
        // res.push({flowerId: 11});
        // res.push({flowerId: 12});
        // res.push({flowerId: 13});
        // res.push({flowerId: 14});
        // res.push({flowerId: 15});
        // res.push({flowerId: 16});
        // res.push({flowerId: 17});
        // res.push({flowerId: 18});
        // res.push({flowerId: 19});
        // res.push({flowerId: 20});
        // res.push({flowerId: 21});
        // res.push({flowerId: 22});
        // res.push({flowerId: 23});
        // res.push({flowerId: 24});
        // res.push({flowerId: 25});
        // res.push({flowerId: 26});
        // res.push({flowerId: 27});
        // res.push({flowerId: 28});
        // res.push({flowerId: 29});
        // res.push({flowerId: 30});
        // res.push({tagId: 1});
        // res.push({tagId: 2});
        // res.push({tagId: 3});
        // res.push({tagId: 4});
        // res.push({tagId: 5});
        // res.push({tagId: 6});
        // res.push({tagId: 7});
        // res.push({tagId: 8});
        // res.push({tagId: 9});
        // res.push({tagId: 10});
        setItemList(res);
        setFlowerList(res.filter(val => val.flowerId));
        setLandmarkList(res.filter(val => val.tagId));
        if (itemRef)
          setTimeout(() => {
            itemRef.scrollToEnd();
          }, 1000);
      })
      .catch(err => console.log(err));
  }, [isFocused, landmarkInfo, itemRef]);

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.log('Tag found', tag.id);
      dispatch(tagging({groupId: groupId, tagUid: tag.id}))
        .unwrap()
        .then(res => {
          console.log('res in readNdef in GardenHomeScreen: ', res);
          setLandmarkInfo(res.tag);
        })
        .catch(err => console.log(err));
    } catch (ex) {
      // console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      handleNfcModalClose();
    }
  }

  const handleNFCTag = async () => {
    readNdef();
    setNfcModalVisible(true);
  };

  const handlePostModalClose = () => {
    setSelectedFlowerId(null);
  };

  const handleNfcModalClose = () => {
    NfcManager.cancelTechnologyRequest();
    setNfcModalVisible(false);
  };

  const handleLandmarkModalClose = () => {
    setLandmarkInfo(null);
  };

  const handleFlowerPress = flowerId => {
    setSelectedFlowerId(flowerId);
  };

  const itemsLayout = ({item, index}) => {
    const flowerId = item.flowerId;
    const sizeIndex = flowerId % 3;
    if (flowerId) {
      return (
        <TouchableOpacity
          style={{justifyContent: 'flex-end'}}
          onPress={() => handleFlowerPress(flowerId)}>
          {sizeIndex === 1 && (
            <Image
              source={gardenFlowerImagePath[flowerId]}
              style={{width: 52, height: 72}}
              resizeMode="contain"
            />
          )}
          {sizeIndex === 2 && (
            <Image
              source={gardenFlowerImagePath[flowerId]}
              style={{width: 52, height: 104}}
              resizeMode="contain"
            />
          )}
          {sizeIndex === 0 && (
            <Image
              source={gardenFlowerImagePath[flowerId]}
              style={{width: 58, height: 148}}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      );
    }

    if (item.tagId) {
      const id = item.tagId;
      return (
        <View style={{justifyContent: 'flex-end'}}>
          {id === 1 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 128, height: 216}}
              resizeMode="contain"
            />
          )}
          {id === 2 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 182, height: 130}}
              resizeMode="contain"
            />
          )}
          {id === 3 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 220, height: 76}}
              resizeMode="contain"
            />
          )}
          {id === 4 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 197, height: 89}}
              resizeMode="contain"
            />
          )}
          {id === 5 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 120, height: 224}}
              resizeMode="contain"
            />
          )}
          {id === 6 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 160, height: 116}}
              resizeMode="contain"
            />
          )}
          {id === 7 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 122, height: 204}}
              resizeMode="contain"
            />
          )}
          {id === 8 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 152, height: 176}}
              resizeMode="contain"
            />
          )}
          {id === 9 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 128, height: 228}}
              resizeMode="contain"
            />
          )}
          {id === 10 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 128, height: 200}}
              resizeMode="contain"
            />
          )}
          {id === 11 && (
            <Image
              source={gardenLandmarkImagePath[id]}
              style={{width: 182, height: 130}}
              resizeMode="cover"
            />
          )}
        </View>
      );
    }
  };

  const flowerListLayout = ({item, index}) => {
    return (
      <View
        style={{
          width: 80,
          height: 80,
          marginTop: 16,
          marginRight: 8,
          backgroundColor: NEUTRAL_950,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={postFlowerImagePath[item.flowerId]}
          style={{width: 40, height: 40}}
          resizeMode="contain"
        />
      </View>
    );
  };
  const landmarkListLayout = ({item, index}) => {
    return (
      <View
        style={{
          width: 80,
          height: 80,
          marginTop: 16,
          marginRight: 8,
          backgroundColor: NEUTRAL_950,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={gardenLandmarkImagePath[item.tagId]}
          style={{width: 60, height: 60}}
          resizeMode="contain"
        />
      </View>
    );
  };

  const {width, height} = Dimensions.get('window');

  return (
    <MainWrapper>
      <View
        style={{
          flexDirection: 'row',
          marginTop: '15%',
          padding: 12,
          backgroundColor: '#111214',
          borderRadius: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 16,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={Profile1}
            resizeMode="cover"
            style={{width: 44, height: 44, marginRight: 8, borderRadius: 8}}
          />
          <View>
            <Heading3>{groupInfo.name} 가든</Heading3>
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
        <TouchableOpacity hitSlop={50} onPress={handleNFCTag}>
          <View
            style={{
              width: 28,
              height: 28,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 8,
            }}>
            <Text style={{fontFamily: 'SUIT-Bold', fontSize: 8, color: '#fff'}}>
              NFC
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: '60%',
        }}>
        <Image
          source={GardenBackground}
          style={{width: '100%', height: '100%', marginTop: 10, zIndex: -1}}
          resizeMode="cover"
        />
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
          }}>
          {itemList.length > 0 && (
            <FlatList
              data={itemList}
              ref={ref => {
                setItemRef(ref);
              }}
              ListHeaderComponent={() => {
                return <View style={{width: 20}} />;
              }}
              renderItem={itemsLayout}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
          )}
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#131415',
          height: '35%',
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{width: 32}}
              onPress={() => setViewType('flower')}>
              <Heading4
                style={{color: viewType === 'flower' ? '#fff' : NEUTRAL_700}}>
                꽃
              </Heading4>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewType('landmark')}>
              <Heading4
                style={{color: viewType === 'landmark' ? '#fff' : NEUTRAL_700}}>
                랜드마크
              </Heading4>
            </TouchableOpacity>
          </View>
          <TouchableOpacity disabled>
            <Body3 style={{color: PRIMARY_500}}>모두 보기</Body3>
          </TouchableOpacity>
        </View>
        {viewType === 'flower' && (
          <FlatList
            data={flowerList}
            renderItem={flowerListLayout}
            horizontal
          />
        )}
        {viewType === 'landmark' && (
          <FlatList
            data={landmarkList}
            renderItem={landmarkListLayout}
            horizontal
          />
        )}
      </View>
      <FlowerModal
        isVisible={Boolean(selectedFlowerId)}
        onClose={handlePostModalClose}
        flowerId={selectedFlowerId}
        groupId={groupId}
        modalStyle={{margin: 0, padding: 0}}
      />
      <Modal
        isVisible={nfcModalVisible}
        onModalHide={handleNfcModalClose}
        onBackdropPress={handleNfcModalClose}
        onSwipeComplete={handleNfcModalClose}
        onBackButtonPress={handleNfcModalClose}
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
            onPress={handleNfcModalClose}
            style={{borderWidth: 0, width: 300, marginTop: 32}}
          />
        </View>
      </Modal>
      <Modal isVisible={Boolean(landmarkInfo)}>
        <View
          style={{
            backgroundColor: NEUTRAL_850,
            width: '100%',
            height: '60%',
            borderRadius: 20,
            alignItems: 'center',
          }}>
          {landmarkInfo && (
            <>
              <Heading3 style={{marginTop: 32}}>축하합니다!</Heading3>
              <Heading3>[{landmarkInfo.name}] 랜드마크를</Heading3>
              <Heading3>획득하셨습니다.</Heading3>
              <Image
                source={gardenLandmarkImagePath[landmarkInfo.id]}
                style={{width: '100%', height: '55%'}}
                resizeMode="contain"
              />
              <Button
                title="정원으로 이동"
                style={{width: width * 0.8, marginTop: '7%', borderRadius: 8}}
                onPress={handleLandmarkModalClose}
              />
            </>
          )}
        </View>
      </Modal>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({});

export default GardenHomeScreen;
