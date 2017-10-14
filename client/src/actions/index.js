import axios from 'axios';
// import {
//   USER_SIGN_IN,
// } from './constants';
import * as actionType from './constants';

export const breadcrumbPush = (data) => {
  return {
    type: actionType.BREADCRUMB_PUSH,
    data,
  };
};

export const breadcrumbPop = (data) => {
  return {
    type: actionType.BREADCRUMB_POP,
    data,
  };
};

export const breadcrumbClear = () => {
  return {
    type: actionType.BREADCRUMB_CLEAR,
  };
};


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
  });
};

export const userSignIn = (data) => {
  return {
    type: actionType.USER_SIGN_IN,
    data,
  };
};

export const checkAuthentication = () => (dispatch) => {
  if (localStorage.getItem('token') !== null ) {
    dispatch(userSignIn());
  }
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
  };
};

export const FetchListing = (data) => {
  return {
    type: actionType.FETCH_LISTING,
    data,
  };
};

// export const axiosUpload = (data) => (dispatch) => {
//   axios.post('http://localhost:3000/uploads', data)
//   .then ( res => {
//     console.log('axiosUpload');
//     console.log(res);

//   }).catch (err => {
//     console.log(err);
//   })
// };

export const addNewFile = (data) => {
  return {
    type: actionType.ADD_NEW_FILE,
    data,
  };
};

export const axiosUpload = (data) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosUpload get token=', token);
  console.log(data);

  axios.post('http://localhost:3000/uploads', data, { 
    headers: {
      token,
    },
  })
  .then ( res => {
    console.log('axiosUpload');
    console.log(res);

    // update the list state
    dispatch(axiosFetchListing());

    dispatch(addNewFile(res.data));

  }).catch (err => {
    console.log(err);
  })
};

export const axiosUploadToPath = (data, currentPath) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosUploadToPath get token=', token);
  console.log("currentPath", currentPath);
  console.log("data", data);
  
  axios.post(`http://localhost:3000/uploads/${currentPath}`, data, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('axiosUploadToPath');
    console.log(res);

    // update the list state
    dispatch(axiosFetchListing());
    dispatch(addNewFile(res.data));
  }).catch((err) => {
    console.log(err);
  })
};

export const axiosFetchListing = () => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosFetchListing token=', token);

  axios.get('http://localhost:3000/uploads/listdir', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchListing');
    console.log(res.data);

    dispatch(FetchListing(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

export const addNewFolder = (data) => {
  return {
    type: actionType.ADD_NEW_FOLDER,
    data,
  };
};

// obselete axios upload method
export const axiosCreateFolder = data => (dispatch) => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('user_email');
  console.log('axiosCreateFolder token=', token);
  console.log('axiosCreateFolder email=', email);

  axios.post('http://localhost:3000/uploads/createfolder', {
    name: data.folderName,
    currentPath: `./public/uploads/${email}`,
  }, {
    headers: {
      token,
    },
  }).then( (res) => {
    console.log('axiosCreateFolder');
    console.log(res);

    // update the list state
    dispatch(axiosFetchListing());

    // update folders list
    dispatch(addNewFolder(res.data));
    
  }).catch (err => {
    console.log(err);
  });
};

export const axiosCreateFolderOnCurrentPath = (data, currentPath) => (dispatch) => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('user_email');
  console.log('axiosCreateFolder token=', token);
  console.log('axiosCreateFolder email=', email);

  axios.post('http://localhost:3000/uploads/createfolder', {
    name: data.folderName,
    currentPath,
  }, {
    headers: {
      token,
    },
  }).then( (res) => {
    console.log('axiosCreateFolder');
    console.log(res);

    // update the list state
    dispatch(axiosFetchListing());

    // update folders list
    dispatch(addNewFolder(res.data));
    
  }).catch (err => {
    console.log(err);
  });
};

export const FetchUserAbout = (data) => {
  return {
    type: actionType.FETCH_USER_ABOUT,
    data,
  };
};

export const axiosFetchUserAbout = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/users/about', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchUserAbout');
    console.log(res.data);

    dispatch(FetchUserAbout(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

export const updateUserAbout = (data) => {
  return {
    type: actionType.UPDATE_USER_ABOUT,
    data,
  };
};

export const axiosUpdateUserAbout = (data) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosUpdateUserAbout data', data);
  axios.put('http://localhost:3000/users/about', {
    ...data
  },{
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosUpdateUserAbout');
    console.log(res.data);

    dispatch(updateUserAbout(data));
  }).catch((err) => {
    console.log(err);
  });
};

export const FetchUserInterest = (data) => {
  return {
    type: actionType.FETCH_USER_INTEREST,
    data,
  };
};

export const axiosFetchUserInterest = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/users/interest', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchUserInterest');
    console.log(res.data);

    dispatch(FetchUserInterest(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

export const updateUserInterest = (data) => {
  return {
    type: actionType.UPDATE_USER_INTEREST,
    data,
  };
};

export const axiosUpdateUserInterest = (data) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosUpdateUserInterest data', data);
  axios.put('http://localhost:3000/users/interest', {
    ...data,
  },{
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosUpdateUserInterest');
    console.log(res.data);

    dispatch(updateUserInterest(data));
  }).catch((err) => {
    console.log(err);
  });
};

export const fetchFiles = (data) => {
  return {
    type: actionType.FETCH_FILES,
    data,
  };
};

export const axiosFetchFiles = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/files', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchFiles');
    console.log(res.data);

    dispatch(fetchFiles(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

export const axiosFetchRootFiles = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/files/root', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchRootFiles');
    console.log(res.data);

    dispatch(fetchFiles(res.data));
  }).catch((err) => {
    console.log(err);
  });
};


export const starFile = (data) => {
  return {
    type: actionType.STAR_FILE,
    data,
  };
};

export const axiosStarFile = (data) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosStarFile data', data);
  axios.put('http://localhost:3000/files/star', {
    ...data,
  },{
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosStarFile');
    console.log(res.data);

    dispatch(starFile(data));

  }).catch((err) => {
    console.log(err);
  });
} 

export const fetchFolders = (data) => {
  return {
    type: actionType.FETCH_FOLDERS,
    data,
  };
};

export const axiosFetchFolders = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/folders', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchFolders');
    console.log(res.data);

    dispatch(fetchFolders(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

export const axiosFetchRootFolders = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/folders/root', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchRootFolders');
    console.log(res.data);

    dispatch(fetchFolders(res.data));
    dispatch(breadcrumbClear());
  }).catch((err) => {
    console.log(err);
  });
};

export const starFolder = (data) => {
  return {
    type: actionType.STAR_FOLDER,
    data,
  };
};

export const axiosStarFolder = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosStarFolder data', data);
  axios.put('http://localhost:3000/folders/star', {
    ...data,
  },{
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosStarFolder');
    console.log(res.data);

    dispatch(starFolder(data));

  }).catch((err) => {
    console.log(err);
  });
} 

export const fetchContentsByFolderId = (data) => {
  return {
    type: actionType.FETCH_CONTENTS_BY_FOLDER_ID,
    data,
  };
};

export const axiosFetchContentsByFolderId = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosFetchContentsByFolderId data=', data);

  axios.get(`http://localhost:3000/folders/${data.id}`, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchContentsByFolderId');
    console.log(res.data);

    dispatch(fetchContentsByFolderId(res.data));
    dispatch(breadcrumbPush(data));

  }).catch((err) => {
    console.log(err);
  });
};


export const axiosFetchContentsByFolderIdBackward = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosFetchContentsByFolderId data=', data);

  axios.get(`http://localhost:3000/folders/${data.id}`, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchContentsByFolderId');
    console.log(res.data);

    dispatch(fetchContentsByFolderId(res.data));
    dispatch(breadcrumbPop(data));

  }).catch((err) => {
    console.log(err);
  });
};

export const fileShareAdd = (data) => {
  return {
    type: actionType.FILE_SHARING_ADD,
    data,
  };
};

export const axiosFileShareAdd = (users, file_id) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log(`axiosFileShareAdd users='${users}', file_id=${file_id}`);
  axios.post(`http://localhost:3000/files/share`, {
    users,
    file_id,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFileShareAdd');
    console.log(res.data);

    //update state
    dispatch(fileShareAdd(res.data));
  });
};

export const fetchShareFiles = (data) => {
  return {
    type: actionType.FETCH_SHARE_FILES,
    data,
  };
};


export const axiosFetchShareFiles = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/files/share', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchShareFiles');
    console.log(res.data);

    dispatch(fetchShareFiles(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

