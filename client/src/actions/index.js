import axios from 'axios';
// import {
//   USER_SIGN_IN,
// } from './constants';
import * as actionType from './constants';


export const axiosSignUp = data => (dispatch) => {
  axios.post('http://localhost:3000/authseq/signup', {
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    password: data.password,
  }).then ( (res) => {
    console.log('axiosSignUp', res);
    dispatch(userSignUp(data));
  }).catch( (err) => {
    console.log(err);
  })
}

export const userSignUp = (data) => {
  console.log('userSignUp', data);
  return {
    type: actionType.USER_SIGN_IN,
    data,
  };
};
