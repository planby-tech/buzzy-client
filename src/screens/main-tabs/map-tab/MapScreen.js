import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  Linking,
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Image,
} from 'react-native';
import MapView, {Marker, enableLatestRenderer} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import MyLocationButton from '../../../components/map-buttons/MyLocationButton.js';
import AddMarkerButton from '../../../components/map-buttons/AddMarkerButton.js';
import SearchButton from '../../../components/map-buttons/SearchButton.js';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {tagging} from '../../../redux/slices/tag';

import EwhaGray15xImg from '../../../assets/images/Ewha-gray-1.5x.png';
import EwhaColor15xImg from '../../../assets/images/Ewha-color-1.5x.png';
import {
  Heading2,
  Heading3,
  Heading5,
} from '../../../components/design-system/FontSystem.js';
import Button from '../../../components/common/SubmitButton.js';
import {MainWrapper} from '../../../components/common/MainWrapper.js';

NfcManager.start();
enableLatestRenderer();

const MapScreen = ({navigation}) => {
  const landmarkList = [
    {
      title: '카이스트',
      tagUid: '042E9B32697380',
      latitude: 36.37049682178313,
      longitude: 127.36128608273715,
      graySource: EwhaGray15xImg,
      colorSource: EwhaColor15xImg,
    },
    {
      title: '이화여자대학교',
      tagUid: '042E9F32697380',
      latitude: 37.562544705628845,
      longitude: 126.94765009467245,
      graySource: EwhaGray15xImg,
      colorSource: EwhaColor15xImg,
    },
    {
      title: '역삼역 4번 출구',
      tagUid: '04F21BFA9D7180',
      latitude: 37.500516238601826,
      longitude: 127.03515980477283,
      graySource: EwhaGray15xImg,
      colorSource: EwhaColor15xImg,
    },
  ];
  const [mapRegion, setMapRegion] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  const {isLoggedIn} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  async function readNdef(landmark) {
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
      handleModalClose();
    }
  }

  useEffect(() => {
    hasLocationPermission().then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setMapRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.007,
              longitudeDelta: 0.007,
            });
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  }, []);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const searchTest = async () => {
    const apiKey = '0d354750cc5df9c00497abcd507c89d5';
    const coord = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${placeName}`,
      {
        headers: {Authorization: `KakaoAK ${apiKey}`},
      },
    );
    const searchLocation = coord.data.documents[0];
    const xCoord = searchLocation.x;
    const yCoord = searchLocation.y;
    console.log(xCoord, yCoord);

    setPlaceName(placeName);

    setIsSearchSubmitted(true);

    setMapRegion({
      ...mapRegion,
      latitude: Number(yCoord),
      longitude: Number(xCoord),
    });
  };

  const handleMyLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position);
        setMapRegion({
          ...mapRegion,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  };

  const [pathDestination, setPathDestination] = useState({});

  const pathFind = destination => {
    let desLat = destination.latitude;
    let desLng = destination.longitude;

    setPathDestination({
      ...pathDestination,
      latitude: desLat,
      longitude: desLng,
    });

    setIsPathActivated(true);
  };

  useEffect(() => {
    if (!isLoggedIn)
      return navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
  }, [isLoggedIn]);

  const customStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    // {
    //   featureType: 'landscape.man_made',
    //   elementType: 'geometry',
    //   stylers: [
    //     {
    //       color: '#80848b',
    //     },
    //   ],
    // },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#263c3f',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6b9a76',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#38414e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#212a37',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9ca5b3',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#1f2835',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#f3d19c',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2f3948',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#515c6d',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
  ];

  const handleMarkerPress = landmark => {
    setSelectedLandmark(landmark);
    readNdef(landmark);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      {mapRegion ? (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation
            showsMyLocationButton
            loadingEnabled
            showsBuildings
            userInterfaceStyle="dark"
            customMapStyle={customStyle}>
            {landmarkList.map(landmark => {
              return (
                <Marker
                  coordinate={{
                    latitude: landmark.latitude,
                    longitude: landmark.longitude,
                  }}
                  key={landmark.tagUid}
                  image={landmark.graySource}
                  title={landmark.title}
                  description="약속 장소로 설정 시 랜드마크 지급!"
                  onPress={() => handleMarkerPress(landmark)}
                />
              );
            })}
          </MapView>
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
                height: '55%',
                backgroundColor: '#3a3a3a',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}>
              <View
                style={{
                  backgroundColor: '#aaa',
                  width: 100,
                  height: 2,
                  borderRadius: 1,
                  marginTop: 15,
                }}
              />
              <Heading2 style={{marginTop: 20}}>NFC 태그</Heading2>
              <Image
                source={
                  selectedLandmark
                    ? selectedLandmark.graySource
                    : EwhaColor15xImg
                }
                style={{width: 120, height: 120, marginTop: 32}}
                resizeMode="contain"
              />
              <Heading5 style={{marginTop: 32}}>
                핸드폰을 NFC 스티커에 태그해 보세요.
              </Heading5>
              <Heading5>특별한 랜드마크를 받을 수 있어요!</Heading5>
              <Button
                title="취소"
                onPress={handleModalClose}
                style={{borderWidth: 0, width: '80%', marginTop: 32}}
              />
            </View>
          </Modal>

          <TextInput
            onChangeText={searchName => setPlaceName(searchName)}
            onSubmitEditing={() => searchTest()}
            placeholder={'검색할 장소를 입력하세요'}
            style={styles.searchInputBox}
          />
          {/* <SearchButton navigation={navigation} /> */}
          <AddMarkerButton />
          {Platform.OS === 'ios' && (
            <MyLocationButton onPress={handleMyLocation} />
          )}
        </View>
      ) : (
        <MainWrapper style={{justifyContent: 'center', alignItems: 'center'}}>
          <Heading3>지도를 불러오는 중입니다...</Heading3>
        </MainWrapper>
      )}
    </>
  );
};
export default MapScreen;

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height - 130,
  },
  searchInputBox: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 200,
    height: 44,
    top: 20,
    left: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#FFDB58',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1,
  },
  heart: {
    position: 'absolute',
    top: 7.5,
    right: 6,
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
});
