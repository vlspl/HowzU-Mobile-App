import axios from 'axios';
// import ToastShow from '../appComponents/ToastShow';

export default axios.interceptors.response.use(
  function (response) {
    // console.log(response, '$$$$$$axios response ');
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);
