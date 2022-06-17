import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from '../common/constant';

const generateQuestion = async (meetingId, userId) => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/meetings/${meetingId}/users/${userId}/questions`, {
      headers: header,
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const questionService = {
  generateQuestion,
};
export default questionService;
