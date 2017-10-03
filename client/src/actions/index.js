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
    type: actionType.USER_SIGN_UP,
    data,
  };
};


export const axiosSignIn = data => (dispatch) => {
  axios.post('http://localhost:3000/authseq/signin', {
    email: data.email,
    password: data.password,
  }).then ( res => {

    // if signin is successful, then save the token in the local storage
    console.log('axiosSignIn done', res);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user_id', res.data.id);
    localStorage.setItem('user_email', res.data.email);

  }).catch( (err) => {
    console.log('Error when signin', err);
    // display the error message
  })
}
