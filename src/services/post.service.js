import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from '../common/constant';

const createPost = async (groupId, meetingId, userId, questionAnswers) => {
  console.log(groupId, meetingId, userId, questionAnswers);
  const header = await authHeader();
  return axios
    .post(
      API_URL +
        `/groups/${groupId}/meetings/${meetingId}/users/${userId}/posts`,
      {questionAnswers},
      {
        headers: header,
      },
    )
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const postService = {
  createPost,
};
export default postService;
