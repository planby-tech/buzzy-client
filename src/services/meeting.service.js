import axios from 'axios';
import authHeader from './auth-header';
import {API_URL} from '../common/constant';

const createMeeting = async (
  groupId,
  title,
  start,
  end,
  allDay,
  places,
  users,
  activities,
) => {
  const header = await authHeader();
  return axios
    .post(
      API_URL + `/groups/${groupId}/meetings`,
      {
        title,
        start,
        end,
        allDay,
        places,
        users,
        activities,
      },
      {headers: header},
    )
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const readMeeting = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const updateMeeting = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const deleteMeeting = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const findPlaces = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const findUsers = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const findActivities = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const findPosts = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};
const findComments = async userId => {
  const header = await authHeader();
  return axios
    .get(API_URL + `/users/${userId}`, {headers: header})
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log(error);
    });
};

const meetingService = {
  createMeeting,
  readMeeting,
  updateMeeting,
  deleteMeeting,
  findPlaces,
  findUsers,
  findActivities,
  findPosts,
  findComments,
};
export default meetingService;
