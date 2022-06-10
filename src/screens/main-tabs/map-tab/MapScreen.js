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
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import MyLocationButton from '../../../components/map-buttons/MyLocationButton.js';
import AddMarkerButton from '../../../components/map-buttons/AddMarkerButton.js';
import SearchButton from '../../../components/map-buttons/SearchButton.js';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

const MapScreen = ({navigation}) => {
  const initialMapRegion = {
    latitude: 36.35948,
    longitude: 127.37895,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  };
  const [mapRegion, setMapRegion] = useState(initialMapRegion);
  const [placeName, setPlaceName] = useState('');
  const [highAccuracy, setHighAccuracy] = useState(true);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const {isLoggedIn} = useSelector(state => state.auth);

  useEffect(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
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
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  };

  const [pathDestination, setPathDestination] = useState({});
  const [isPathActivated, setIsPathActivated] = useState(false);

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

  return (
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
        {!isSearchSubmitted ? null : (
          <Marker
            coordinate={mapRegion}
            title={placeName}
            description="우리 여기서 일해요"
            onPress={e => {
              pathFind(e.nativeEvent.coordinate);
            }}
          />
        )}
        {isPathActivated && (
          <MapViewDirections
            origin={{
              latitude: 37.47656223234824,
              latitudeDelta: 0.003,
              longitude: 126.98155858357366,
              longitudeDelta: 0.003,
            }}
            destination={{
              latitude: 37.4755845620958,
              latitudeDelta: 0.003,
              longitude: 126.987966657679,
              longitudeDelta: 0.003,
            }}
            apikey={'AIzaSyC8JB0IEQQ_nPoz_YfDy5qZLSxBLFUHdB4'}
            mode={'TRANSIT'}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        )}
      </MapView>
      <TextInput
        onChangeText={searchName => setPlaceName(searchName)}
        onSubmitEditing={() => searchTest()}
        placeholder={'검색할 장소를 입력하세요'}
        style={styles.searchInputBox}
      />
      {/* <SearchButton navigation={navigation} /> */}
      <AddMarkerButton />
      {Platform.OS === 'ios' && <MyLocationButton onPress={handleMyLocation} />}
      {/* 
      <View
        style={{
          height: '100%',
          width: 20,
          zIndex: 2,
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0)',
        }}
      /> */}
    </View>
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
