import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from '../common/constant';

const findPosts = async (groupId, flowerId) => {
  console.log(groupId, flowerId);
  const header = await authHeader();
  return axios
    .get(API_URL + `/groups/${groupId}/flowers/${flowerId}/posts`, {
      headers: header,
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const flowerService = {
  findPosts,
};
export default flowerService;
