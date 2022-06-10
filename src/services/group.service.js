import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../common/constant';
import authHeader from './auth-header';

const createGroup = async (userId, name, description) => {
  console.log(userId, name, description);
  const header = await authHeader();
  return axios
    .post(
      API_URL + `/users/${userId}/groups`,
      {
        name,
        description,
      },
      {headers: header},
    )
    .then(res => {
      console.log(res.data.group);
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const joinGroup = async (userId, groupCode) => {
  const header = await authHeader();
  console.log(header, userId, groupCode);
  return axios
    .patch(
      `${API_URL}/users/${userId}/groups/${groupCode}`,
      {},
      {headers: header},
    )
    .then(res => {
      console.log(res);
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const findByGroup = async (userId, groupId) => {
  const header = await authHeader();
  return axios
    .get(`${API_URL}/users/${userId}/groups/${groupId}/users`, {
      headers: header,
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const updateGroup = async (userId, groupId) => {
  const header = await authHeader();
  return axios
    .put(API_URL + `/users/${userId}/groups/${groupId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const deleteGroup = async (userId, groupId) => {
  const header = await authHeader();
  return axios
    .delete(API_URL + `/users/${userId}/groups/${groupId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const groupService = {
  createGroup,
  joinGroup,
  findByGroup,
  updateGroup,
  deleteGroup,
};
export default groupService;
