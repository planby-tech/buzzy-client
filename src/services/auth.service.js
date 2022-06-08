import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../common/constant';

const AUTH_URL = API_URL + '/auth';

const register = (name, email, password1, password2) => {
  return axios.post(AUTH_URL + '/join', {
    name,
    email,
    password1,
    password2,
  });
};
const login = async (email, password) => {
  return axios
    .post(AUTH_URL + '/login', {
      email,
      password,
    })
    .then(response => {
      console.log(response.data);
      if (response.data.accessToken) {
        setLoginLocal('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};
const setLoginLocal = async (userKey, userValue) => {
  try {
    await AsyncStorage.setItem(userKey, userValue);
  } catch (err) {
    console.log(err);
  }
};
const loadUserData = async () => {
  return AsyncStorage.getItem('user').then(userData => {
    const jsonUserData = JSON.parse(userData);
    console.log(
      'jsonUserData.accessToken in authService: ' +
        JSON.stringify(jsonUserData),
    );
    if (jsonUserData.accessToken) return jsonUserData;
  });
  // return JSON.parse(await AsyncStorage.getItem('user'));
};
const logout = async () => {
  console.log('logout');
  return await AsyncStorage.removeItem('user', async () => {
    const userData = await AsyncStorage.getItem('user');
    console.log(
      'userData in logout in authService: ' + JSON.stringify(userData),
    );
  });
};
const authService = {
  register,
  login,
  logout,
  loadUserData,
};
export default authService;
