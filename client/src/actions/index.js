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


export const axiosSignIn = (data, router) => (dispatch) => {
  axios.post('http://localhost:3000/authseq/signin', {
    email: data.email,
    password: data.password,
  }).then ( res => {

    // if signin is successful, then save the token in the local storage
    console.log('axiosSignIn done', res);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user_id', res.data.id);
    localStorage.setItem('user_email', res.data.email);
    localStorage.setItem('user_firstname', res.data.firstname);
    localStorage.setItem('user_lastname', res.data.lastname);
    
    router.push('/home');

    dispatch(userSignIn(data));
    
  }).catch( (err) => {
    console.log('Error when signin', err);
    // display the error message
  })
}

export const userSignIn = (data) => {
  return {
    type: actionType.USER_SIGN_IN,
    data,
  };
};

export const userSignOut = () => {
  console.log('userSignOut');
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_firstname');
  localStorage.removeItem('user_lastname');
  
  return {
    type: actionType.USER_SIGN_OUT,
  }
}

// export const axiosUpload = (data) => (dispatch) => {
//   axios.post('http://localhost:3000/uploads', data)
//   .then ( res => {
//     console.log('axiosUpload');
//     console.log(res);

//   }).catch (err => {
//     console.log(err);
//   })
// };

export const axiosUpload = (data) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosUpload get token=', token);

  axios.post('http://localhost:3000/uploads', data, { 
    headers: {
      token,
    },
  })
  .then ( res => {
    console.log('axiosUpload');
    console.log(res);

  }).catch (err => {
    console.log(err);
  })
};
