import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {register, login} from '../../redux/slices/auth';
import {clearMessage} from '../../redux/slices/message';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {MainWrapper} from '../../components/common/MainWrapper';
import {Body3, Heading1} from '../../components/design-system/FontSystem';
import Button from '../../components/common/SubmitButton';
import {CheckIcon} from '../../components/design-system/IconSystem';

const Register = ({navigation}) => {
  const [successful, setSuccessful] = useState(false);
  const {message} = useSelector(state => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    name: '',
    email: '',
    password1: '',
    password2: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .test(
        'len',
        'The name must be between 2 and 20 characters.',
        val => val && val.toString().length >= 2 && val.toString().length <= 20,
      )
      .required('필수 입력 사항입니다.'),
    email: Yup.string()
      .email('올바른 이메일 형식을 작성해주세요.')
      .required('필수 입력 사항입니다.'),
    password1: Yup.string()
      .required('필수 입력 사항입니다.')
      .matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.{8,32})/,
        '비밀번호는 영어와 숫자를 포함하여 8글자 이상 32글자 이내여야 합니다.',
      )
      .matches(/^\S*$/, '공백을 포함할 수 없습니다.'),
    password2: Yup.string().when('password1', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('password1')],
        'Password does not match.',
      ),
    }),
  });

  const handleRegister = formValue => {
    const {name, email, password1, password2} = formValue;
    setSuccessful(false);
    dispatch(register({name, email, password1, password2}))
      .unwrap()
      .then(() => {
        setSuccessful(true);
        dispatch(login({email: email, password: password1}))
          .unwrap()
          .then(res => {
            console.log(res);
            if (res.user.accessToken) {
              navigation.reset({
                index: 0,
                routes: [{name: 'Landing', params: {name: name}}],
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  const handleNavigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <MainWrapper style={styles.loginContainer} edgeSpacing={16}>
      <Heading1>회원가입</Heading1>
      <View style={{flexDirection: 'row', marginTop: 12}}>
        <Body3>이미 가입하셨나요? </Body3>
        <TouchableOpacity onPress={handleNavigateToLogin}>
          <Body3 style={{color: '#4FDBB2'}}>로그인 하러 가기</Body3>
        </TouchableOpacity>
      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <>
            <TextInput
              name="name"
              placeholder="이름"
              placeholderTextColor="#ccc"
              style={{...styles.textInput, marginTop: 24}}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {errors.name && (
              <Text style={{fontSize: 10, color: 'orange'}}>{errors.name}</Text>
            )}
            <TextInput
              name="email"
              placeholder="이메일 주소"
              placeholderTextColor="#ccc"
              style={styles.textInput}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={{fontSize: 10, color: 'orange'}}>
                {errors.email}
              </Text>
            )}
            <TextInput
              name="password1"
              placeholder="비밀번호"
              placeholderTextColor="#ccc"
              style={styles.textInput}
              onChangeText={handleChange('password1')}
              onBlur={handleBlur('password1')}
              value={values.password1}
              secureTextEntry
            />
            {errors.password1 && (
              <Text style={{fontSize: 10, color: 'orange'}}>
                {errors.password1}
              </Text>
            )}
            <TextInput
              name="password2"
              placeholder="비밀번호 확인"
              placeholderTextColor="#ccc"
              style={styles.textInput}
              onChangeText={handleChange('password2')}
              onBlur={handleBlur('password2')}
              value={values.password2}
              secureTextEntry
            />
            {errors.password2 && (
              <Text style={{fontSize: 10, color: 'orange'}}>
                {errors.password2}
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
              }}>
              <CheckIcon />
              <Body3> 개인정보 이용약관 동의</Body3>
            </View>
            <Button
              onPress={handleSubmit}
              title="계정 생성하기"
              disabled={!isValid}
              style={{marginTop: 36}}
            />
          </>
        )}
      </Formik>
      {message !== undefined && (
        <View>
          <Text>{message}</Text>
        </View>
      )}
    </MainWrapper>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: '100%',
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
});

export default Register;
