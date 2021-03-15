import axios from 'axios';

const RESOURCE = process.env.restApi;
const standardEndpoint = '/upload';
const headers = {
  headers: {
    'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

export default {
  async uploadAttachment (formData, endpoint) {
    const res = await axios.post(RESOURCE + endpoint + standardEndpoint, formData, headers);
    return res;
  }
};
