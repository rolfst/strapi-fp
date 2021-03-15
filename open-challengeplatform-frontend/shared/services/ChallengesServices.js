import axios from 'axios';
const RESOURCE = process.env.restApi + 'challenges/';

export default {
  getChallengeDetails (challengeId) {
    return axios.get(RESOURCE + challengeId);
  }
};
