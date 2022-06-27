import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from '../common/constant';

const uploadPostImage = async (postId, photoData) => {
  console.log(postId, 'photoData in imageService: ', JSON.stringify(photoData));
  const header = await authHeader();

  return fetch(`${API_URL}/posts/${postId}/images`, {
    method: 'post',
    body: photoData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('response', response.data);
    })
    .catch(error => {
      console.log('error', error);
    });
};

const imageService = {
  uploadPostImage,
};
export default imageService;
