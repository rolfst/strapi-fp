export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    config.headers.common.kvkmasterid = '09501717-87b1-48fe-adaa-a2d4040325f1';
  });
}
