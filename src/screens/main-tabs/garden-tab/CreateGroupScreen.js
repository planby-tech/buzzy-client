import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {clearMessage} from '../../../redux/slices/message';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {createGroup} from '../../../redux/slices/group';
import Button from '../../../components/common/SubmitButton';
import ScreenHeader from '../../../components/common/ScreenHeader';
import {MainWrapper} from '../../../components/common/MainWrapper';
import Profile1 from '../../../assets/images/Profile-1.png';
import Profile2 from '../../../assets/images/Profile-2.png';
import Profile3 from '../../../assets/images/Profile-3.png';
import Profile4 from '../../../assets/images/Profile-4.png';
import Profile5 from '../../../assets/images/Profile-5.png';
import Profile6 from '../../../assets/images/Profile-6.png';
import Profile7 from '../../../assets/images/Profile-7.png';
import Profile8 from '../../../assets/images/Profile-8.png';
import {Body3} from '../../../components/design-system/FontSystem';

const CreateGroupScreen = ({navigation}) => {
  const profileImageList = [
    {source: Profile1, id: 1},
    {source: Profile2, id: 2},
    {source: Profile3, id: 3},
    {source: Profile4, id: 4},
    {source: Profile5, id: 5},
    {source: Profile6, id: 6},
    {source: Profile7, id: 7},
    {source: Profile8, id: 8},
  ];
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.auth);
  const userId = user ? user.user.id : 0;
  const {message} = useSelector(state => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    name: '',
    description: '',
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('정원 이름은 필수 입력 사항입니다.'),
  });
  const handleCreateGroup = (formValue, {resetForm}) => {
    const {name, description} = formValue;
    setLoading(true);
    dispatch(createGroup({userId, name, description}))
      .unwrap()
      .then(res => {
        console.log(res);
        navigation.navigate('InvitationCodePublish', {
          groupCode: res.group.groupCode,
        });
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <MainWrapper edgeSpacing={16}>
      <ScreenHeader navigation={navigation} title="가든 생성" />
      <View>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleCreateGroup}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <>
              <Body3 style={styles.inputTitle}>정원 이름</Body3>
              <TextInput
                name="name"
                placeholder="정원의 이름을 적어주세요."
                placeholderTextColor="#ccc"
                style={styles.textInput}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {errors.name && (
                <Text
                  style={{
                    paddingLeft: 10,
                    fontSize: 10,
                    color: 'tomato',
                    marginBottom: 10,
                  }}>
                  {errors.name}
                </Text>
              )}
              <Body3 style={styles.inputTitle}>
                어떤 정원을 만드실 건가요?
              </Body3>
              <TextInput
                name="description"
                placeholder="정원에 대한 설명을 적어주세요."
                placeholderTextColor="#ccc"
                style={styles.textInput}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />
              <Button
                onPress={handleSubmit}
                title="다음"
                style={{marginTop: 40}}
              />
            </>
          )}
        </Formik>
      </View>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    color: '#fff',
    marginTop: 16,
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

export default CreateGroupScreen;
