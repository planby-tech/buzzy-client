import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {login} from '../../redux/slices/auth';
import {clearMessage} from '../../redux/slices/message';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  LogBox,
} from 'react-native';
import {MainWrapper} from '../../components/common/MainWrapper';
import {
  Body2,
  Body3,
  Heading1,
} from '../../components/design-system/FontSystem';
import Button from '../../components/common/SubmitButton';

const LoginScreen = ({navigation}) => {
  LogBox.ignoreLogs([]);
  const [loading, setLoading] = useState(false);
  // const {isLoggedIn} = useSelector(state => state.auth);
  const {message} = useSelector(state => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    email: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('필수 입력 사항입니다.'),
    password: Yup.string().required('필수 입력 사항입니다.'),
  });
  const handleLogin = formValue => {
    const {email, password} = formValue;
    setLoading(true);
    dispatch(login({email, password}))
      .unwrap()
      .then(res => {
        if (res.user.accessToken) {
          setLoading(false);
          navigation.reset({
            index: 0,
            routes: [{name: 'Splash'}],
          });
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  useEffect(() => {
    showMessage({
      message:
        '유저 데이터를 불러 오는 데 실패하였습니다. 다시 로그인 해주세요.',
      type: 'simple message',
    });
  }, []);

  // useEffect(() => {
  //   dispatch(loadUserData()).unwrap();
  // }, [dispatch]);

  // useEffect(() => {
  //   console.log('isLoggedIn in LoginScreen.js useEffect: ' + isLoggedIn);
  //   if (isLoggedIn) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Splash'}],
  //     });
  //   }
  // }, [isLoggedIn]);

  return (
    <MainWrapper style={styles.loginContainer} edgeSpacing={16}>
      <Heading1>로그인</Heading1>
      <View style={{flexDirection: 'row', marginTop: 12}}>
        <Body3>신규 사용자이신가요? </Body3>
        <TouchableOpacity onPress={handleNavigateToRegister}>
          <Body3 style={{color: '#4FDBB2'}}>회원가입하기</Body3>
        </TouchableOpacity>
      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <TextInput
              name="email"
              placeholder="이메일 주소"
              placeholderTextColor="#ccc"
              style={{...styles.textInput, marginTop: 24}}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && (
              <Text style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
            )}
            <TextInput
              name="password"
              placeholder="비밀번호"
              placeholderTextColor="#ccc"
              style={styles.textInput}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.email && (
              <Text style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <TouchableOpacity disabled>
                <Body3 style={{color: '#777'}}>이메일/비밀번호 찾기</Body3>
              </TouchableOpacity>
            </View>
            <Button
              onPress={handleSubmit}
              title="로그인"
              disabled={loading}
              style={{marginTop: 24}}
            />
          </>
        )}
      </Formik>
      {message !== undefined && (
        <View>
          <Text>{message}</Text>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 48,
        }}>
        <View style={{width: '40%', height: 1, backgroundColor: '#2a2a2a'}} />
        <Body2>또는</Body2>
        <View style={{width: '40%', height: 1, backgroundColor: '#2a2a2a'}} />
      </View>
      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 36}}>
        <View
          style={{
            flexDirection: 'row',
            width: '60%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              ...styles.oAuthButton,
              backgroundColor: 'yellow',
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.oAuthButton,
              backgroundColor: 'white',
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.oAuthButton,
              backgroundColor: 'royalblue',
            }}></TouchableOpacity>
        </View>
      </View>
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
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
  oAuthButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
export default LoginScreen;
