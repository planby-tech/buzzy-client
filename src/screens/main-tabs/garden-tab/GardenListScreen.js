import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {MainWrapper} from '../../../components/common/MainWrapper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {GREEN_COLOR} from '../../../common/colors';
import {findByUser} from '../../../redux/slices/user';
import {
  Body3,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
} from '../../../components/design-system/FontSystem';

const GardenListScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const userId = user.user.id;
  const {groupArray} = useSelector(state => state.user);

  const dispatch = useDispatch();

  // const [groupArray, setGroupArray] = useState([{ name: "name" }]);
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [mainType, setMainType] = useState('가든');
  const isFocused = useIsFocused();

  const [backPressedOnce, setBackPressedOnce] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressedOnce) return false;
        else {
          showMessage({
            message: '뒤로 가기를 한 번 더 하시면 앱이 종료됩니다.',
            type: 'Simple message',
          });
          setBackPressedOnce(true);
          setTimeout(() => {
            setBackPressedOnce(false);
          }, 2250);
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [backPressedOnce]),
  );

  useEffect(() => {
    dispatch(findByUser(userId))
      .unwrap()
      .then(data => {
        setGroupLoaded(true);
        if (data === null)
          setGroupArray([
            {name: 'Garden name', description: 'garden description'},
          ]);
      });
  }, [isFocused]);

  const groupListLayout = ({item}) => {
    const handleNavigate = () => {
      navigation.navigate('GardenTabs', item);
    };
    return (
      <TouchableOpacity
        onPress={handleNavigate}
        style={{
          width: 140,
          height: 150,
          backgroundColor: '#3A3A3A',
          borderRadius: 10,
          padding: 12,
          paddingTop: 9,
          marginRight: 16,
        }}
        activeOpacity={0.5}>
        <Heading5 numberOfLines={3}>{item.name}</Heading5>
      </TouchableOpacity>
    );
  };

  const AddGroupButton = () => {
    const handleAddGroup = () => {
      navigation.navigate('AddGroup');
    };

    return (
      <TouchableOpacity
        onPress={handleAddGroup}
        style={{
          width: 130,
          height: 140,
          backgroundColor: GREEN_COLOR,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#FFF', fontSize: 15}}>+ 정원 추가하기</Text>
      </TouchableOpacity>
    );
  };

  //handleNavigate
  const handleNavigateToNFC = () => {
    navigation.navigate('NFCTag');
  };

  const handleNavigateToNews = () => {
    navigation.navigate('News');
  };

  const handleNavigateToAddGroup = () => {
    navigation.navigate('AddGroup');
  };

  const handleNavigateToGardenListColumn = () => {
    navigation.navigate('GardenListColumn', groupArray);
  };

  return groupLoaded ? (
    <MainWrapper edgeSpacing={16}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setMainType('가든')}>
            <Heading2
              style={
                mainType === '가든'
                  ? styles.headerTitle
                  : {...styles.headerTitle, color: `rgba(255,255,255,0.42)`}
              }>
              가든
            </Heading2>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMainType('채팅')}>
            <Heading2
              style={
                mainType === '채팅'
                  ? styles.headerTitle
                  : {...styles.headerTitle, color: `rgba(255,255,255,0.42)`}
              }>
              채팅
            </Heading2>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={handleNavigateToNews}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToAddGroup}>
            <MaterialCommunityIcons name="plus" size={34} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginTop: 24,
          padding: 20,
          paddingTop: 15,
          borderColor: '#3A3A3A',
          borderWidth: 2,
          borderStyle: 'dashed',
          height: '60%',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Heading3
          style={{
            marginBottom: 10,
          }}>
          가든 목록에서 핀
          <MaterialCommunityIcons
            name="pin-outline"
            size={18}
            color="#fff"
          />{' '}
          해보세요.
        </Heading3>
        <TouchableOpacity activeOpacity={0.6}>
          <Body3>
            고정하러 가기
            <MaterialCommunityIcons
              name="chevron-right"
              color="#fff"
              size={14}
            />
          </Body3>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Heading4
          style={{
            margin: 15,
            marginLeft: 0,
          }}>
          All gardens
        </Heading4>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleNavigateToGardenListColumn}>
          <Body3
            style={{
              color: GREEN_COLOR,
              marginVertical: 15,
            }}>
            View all
          </Body3>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={groupArray}
        renderItem={groupListLayout}
        keyExtractor={(item, index) => index}
        // ListFooterComponent={AddGroupButton}
      />
    </MainWrapper>
  ) : (
    <MainWrapper />
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    marginRight: 15,
  },
});

export default GardenListScreen;
