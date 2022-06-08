import React from 'react';
import {Formik} from 'formik';
import {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import {GREEN_COLOR} from '../../../common/colors';
import {MainWrapper} from '../../../components/common/MainWrapper';
import CreateGroupScreen from './CreateGroupScreen';
import JoinGroupScreen from './JoinGroupScreen';
import {useSelector} from 'react-redux';

const AddGroupScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const userId = user.user.id;
  const [type, setType] = useState('create');
  return (
    <MainWrapper>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity
          style={
            type === 'create'
              ? styles.activeTypeButton
              : styles.inactiveTypeButton
          }
          onPress={() => setType('create')}
          activeOpacity={0.8}>
          <Text
            style={
              type === 'create'
                ? styles.activeButtonTitle
                : styles.inactiveButtonTitle
            }>
            그룹 생성하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            type === 'join'
              ? styles.activeTypeButton
              : styles.inactiveTypeButton
          }
          onPress={() => setType('join')}
          activeOpacity={0.8}>
          <Text
            style={
              type === 'join'
                ? styles.activeButtonTitle
                : styles.inactiveButtonTitle
            }>
            그룹 참여하기
          </Text>
        </TouchableOpacity>
      </View>
      {type === 'create' && (
        <CreateGroupScreen navigation={navigation} userId={userId} />
      )}
      {type === 'join' && (
        <JoinGroupScreen navigation={navigation} userId={userId} />
      )}
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  activeTypeButton: {
    flex: 1,
    height: 50,
    borderBottomColor: GREEN_COLOR,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveTypeButton: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButtonTitle: {
    color: GREEN_COLOR,
    fontSize: 17,
  },
  inactiveButtonTitle: {
    color: '#fff',
    fontSize: 17,
  },
});

export default AddGroupScreen;
