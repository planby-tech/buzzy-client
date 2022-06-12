import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from '../common/constant';

const tagging = async (groupId, tagUid) => {
  console.log(groupId, tagUid);
  const header = await authHeader();
  return axios
    .post(API_URL + `/groups/${groupId}/tags/${tagUid}`, {}, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const tagService = {
  tagging,
};
export default tagService;
