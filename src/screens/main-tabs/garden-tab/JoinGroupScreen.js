import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {clearMessage} from '../../../redux/slices/message';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {joinGroup} from '../../../redux/slices/group';
import Button from '../../../components/common/SubmitButton';
import {MainWrapper} from '../../../components/common/MainWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import {Body3, Tiny} from '../../../components/design-system/FontSystem';

const JoinGroupScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {isLoggedIn} = useSelector(state => state.auth);
  const {message} = useSelector(state => state.message);
  const {user} = useSelector(state => state.auth);
  const userId = user ? user.user.id : 0;
  // console.log('userId in JoinGroupScreen: ' + userId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    groupCode: '',
  };
  const validationSchema = Yup.object().shape({
    groupCode: Yup.string().required('필수 입력 사항입니다.'),
  });
  const handleJoinGroup = formValue => {
    const {groupCode} = formValue;
    setLoading(true);
    dispatch(joinGroup({userId: userId, groupCode: groupCode}))
      .unwrap()
      .then(() => {
        navigation.navigate('GardenTabs');
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <MainWrapper edgeSpacing={16}>
      <ScreenHeader navigation={navigation} title="가든 초대 코드 입력하기" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleJoinGroup}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <View style={{flex: 1}}>
              <Body3 style={styles.inputTitle}>정원 초대 코드</Body3>
              <TextInput
                name="groupCode"
                placeholder="정원 초대 코드를 입력해 주세요."
                placeholderTextColor="#ccc"
                style={styles.textInput}
                onChangeText={handleChange('groupCode')}
                onBlur={handleBlur('groupCode')}
                value={values.groupCode}
              />
              {errors.groupCode && (
                <Tiny style={{marginTop: 6, color: 'tomato'}}>
                  {errors.groupCode}
                </Tiny>
              )}
            </View>
            <Button onPress={handleSubmit} title="가든 참가하기" />
          </>
        )}
      </Formik>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    marginTop: 48,
  },
  textInput: {
    height: 48,
    width: '100%',
    marginTop: 16,
    paddingLeft: 16,
    backgroundColor: '#202225',
    borderRadius: 12,
    color: '#fff',
    fontFamily: 'SUIT-Regular',
    fontSize: 16,
  },
  submitButton: {
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 20,
    padding: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JoinGroupScreen;
