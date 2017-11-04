import axios from 'axios';
// import {
//   USER_SIGN_IN,
// } from './constants';
import * as actionType from './constants';


// ==============================================================================
// Activities
// ==============================================================================
export const fetchActivities = (data) => {
  return {
    type: actionType.FETCH_ACTIVITIES,
    data,
  };
};

export const axiosFetchActivities = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/users/activities', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchActivities');
    console.log(res.data);

    dispatch(fetchActivities(res.data));
  }).catch((err) => {
    console.log(err);
  });
};

export const addActivity = (data) => {
  return {
    type: actionType.ADD_ACTIVITY,
    data,
  };
};

export const axiosAddActivity = (action, description) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log(`axiosAddActivity action='${action}', description=${description}`);
  axios.post(`http://localhost:3000/users/activities`, {
    action,
    description,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosAddActivity');
    console.log(res.data);

    //update state
    dispatch(addActivity(res.data));
  });
};

// ==============================================================================


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


export const axiosSignUp = (data, router) => (dispatch) => {
  axios.post('http://localhost:3000/auth/signup', {
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    password: data.password,
  }).then((res) => {
    console.log('===> axiosSignUp res.data', res.data);
    if (res.data.message) {
      dispatch(signUpError({ message: res.data.message }));
    }
    else {
      console.log('axiosSignUp', res);
      dispatch(userSignUp(data));
      dispatch(signUpSuccess({ message: `You have created an account using ${data.email}. Please sign in.` }));
      router.push('/signin');
    }

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

export const signUpError = (data) => {
  return {
    type: actionType.SIGN_UP_ERROR,
    data,
  };
};

export const signUpSuccess = (data) => {
  return {
    type: actionType.SIGN_UP_SUCCESS,
    data,
  };
};

export const signUpErrorClear = () => {
  return {
    type: actionType.SIGN_UP_ERROR_CLEAR,
  };
};

export const signUpSuccessClear = () => {
  return {
    type: actionType.SIGN_UP_SUCCESS_CLEAR,
  };
};

export const signInErrorClear = () => {
  return {
    type: actionType.SIGN_IN_ERROR_CLEAR,
  };
};


export const axiosSignIn = (data, router) => (dispatch) => {
  axios.post('http://localhost:3000/auth/signin', {
    email: data.email,
    password: data.password,
  }).then((res) => {
    // if signin is successful, then save the token in the local storage
    console.log('axiosSignIn done', res);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user_id', res.data._id);
    localStorage.setItem('user_email', res.data.email);
    localStorage.setItem('user_firstname', res.data.firstname);
    localStorage.setItem('user_lastname', res.data.lastname);
    // localStorage.setItem('user_mysql_id', res.data.mysql_id);
    // localStorage.setItem('user_mongo_id', res.data.mongo_id);
    
    router.push('/home');

    dispatch(userSignIn(data));
    
    dispatch(signInErrorClear());
    dispatch(signUpErrorClear());
    dispatch(signUpSuccessClear());

    dispatch(axiosAddActivity(actionType.USER_SIGN_IN, 'User sign in'));
  }).catch( (err) => {
    console.log('Error when signin', err);
    // display the error message
    dispatch(signInError({ message: 'Sign in failed. Please check your username and password.' }));
  });
};

export const signInError = (data) => {
  return {
    type: actionType.SIGN_IN_ERROR,
    data,
  };
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

export const userSignOutReducer = () => {
  return {
    type: actionType.USER_SIGN_OUT,
  };
};

export const userSignOut = () => (dispatch) => {
  console.log('userSignOut');

  // need to log before clearing out localStorage
  dispatch(axiosAddActivity(actionType.USER_SIGN_OUT, 'User sign out'));
  
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_firstname');
  localStorage.removeItem('user_lastname');
  // localStorage.removeItem('user_mysql_id');
  // localStorage.removeItem('user_mongo_id');

  // router.push('/');
  dispatch(userSignOutReducer());

  console.log("here");

  // return {
  //   type: actionType.USER_SIGN_OUT,
  // };
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
    // dispatch(axiosFetchListing());

    dispatch(addNewFile(res.data));

  }).catch (err => {
    console.log(err);
  })
};

// using this on components/FileUpload.js
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
    // dispatch(axiosFetchListing());
    dispatch(addNewFile(res.data));


    // Log activity
    const user_email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${user_email}(/?)`);
    const path = res.data.path.replace(re, './');
    // console.log(`newaddress = [${path}]`);

    dispatch(axiosAddActivity(actionType.ADD_NEW_FILE, `Upload a new file [${res.data.name}] on path [${path}]`));
    
  }).catch((err) => {
    console.log(err);
  })
};

export const axiosUploadToPathMongo = (data, currentPath) => (dispatch) => {
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
    // dispatch(axiosFetchListing());
    dispatch(addNewFile(res.data));


    // Log activity
    const user_email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${user_email}(/?)`);
    const path = res.data.path.replace(re, './');
    // console.log(`newaddress = [${path}]`);

    dispatch(axiosAddActivity(actionType.ADD_NEW_FILE, `Upload a new file [${res.data.name}] on path [${path}]`));
    
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
    // dispatch(axiosFetchListing());

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
  }).then((res) => {
    console.log('axiosCreateFolder');
    console.log(res);

    // update the list state
    // dispatch(axiosFetchListing());

    // update folders list
    dispatch(addNewFolder(res.data));
    
    // Log activity
    // const user_email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = res.data.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.ADD_NEW_FOLDER, `Create a new folder [${res.data.name}] on path:[${path}]`));
  }).catch((err) => {
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
    dispatch(axiosAddActivity(actionType.UPDATE_USER_ABOUT, `Update User About`));
    
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

export const axiosUpdateUserInterest = data => (dispatch) => {
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
    dispatch(axiosAddActivity(actionType.UPDATE_USER_INTEREST, `Update User Interest`));
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

export const axiosStarFile = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosStarFile data', data);
  axios.put('http://localhost:3000/files/star', {
    ...data,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosStarFile');
    console.log(res.data);

    dispatch(starFile(data));

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = data.path.replace(re, './');
    const desc = data.is_starred ? 'Add' : 'Remove';

    dispatch(axiosAddActivity(actionType.STAR_FILE, `${desc} a Star to file [${data.name}] on path [${path}]`));
  }).catch((err) => {
    console.log(err);
  });
} 

export const deleteFile = (data) => {
  return {
    type: actionType.DELETE_FILE,
    data,
  };
};

export const axiosDeleteFile = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosDeleteFile data', data);
  axios.put('http://localhost:3000/files/delete', {
    ...data,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosDeleteFile');
    console.log(res.data);

    dispatch(deleteFile(data));

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = data.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.DELETE_FILE, `Delete a file [${data.name}] on path [${path}]`));

  }).catch((err) => {
    console.log(err);
  });
};

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

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = data.path.replace(re, './');
    const desc = data.is_starred ? 'Add' : 'Remove';
    
    dispatch(axiosAddActivity(actionType.STAR_FOLDER, `${desc} a Star to folder [${data.name}] on path [${path}]`));

  }).catch((err) => {
    console.log(err);
  });
};

export const deleteFolder = (data) => {
  return {
    type: actionType.DELETE_FOLDER,
    data,
  };
};

export const axiosDeleteFolder = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosDeleteFolder data', data);
  axios.put('http://localhost:3000/folders/delete', {
    ...data,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosDeleteFolder');
    console.log(res.data);

    dispatch(deleteFolder(data));

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = data.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.DELETE_FOLDER, `Delete a folder [${data.name}] on path [${path}]`));


  }).catch((err) => {
    console.log(err);
  });
};

export const fetchContentsByFolderId = (data) => {
  return {
    type: actionType.FETCH_CONTENTS_BY_FOLDER_ID,
    data,
  };
};

export const axiosFetchContentsByFolderId = data => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log('axiosFetchContentsByFolderId data=', data);

  axios.get(`http://localhost:3000/folders/${data._id}`, {
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

  axios.get(`http://localhost:3000/folders/${data._id}`, {
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

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = res.data.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.FILE_SHARING_ADD, `Share a file [${res.data.name}] on path [${path}] with [${users}]`));

  });
};

export const fileShareRemove = (data) => {
  return {
    type: actionType.FILE_SHARING_REMOVE,
    data,
  };
};

export const axiosFileShareRemove = (user, file) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log(`axiosFileShareRemove user._id='${user._id}', file._id=${file._id}`);
  console.log('token=', token);

  axios.put(`http://localhost:3000/files/share`, {
    user_id: user._id,
    file_id: file._id,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFileShareRemove');
    console.log('%%%%%% ',res.data);

    // update state
    dispatch(fileShareRemove({ user_id: user._id, file_id: file._id }));

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = file.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.FILE_SHARING_REMOVE, `Remove [${user.email}] share access to file [${file.name}] on path [${path}]`));
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

export const folderShareAdd = (data) => {
  return {
    type: actionType.FOLDER_SHARING_ADD,
    data,
  };
};

export const axiosFolderShareAdd = (users, folder_id) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log(`axiosFolderShareAdd users='${users}', folder_id=${folder_id}`);
  axios.post(`http://localhost:3000/folders/share`, {
    users,
    folder_id,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFolderShareAdd');
    console.log(res.data);

    //update state
    dispatch(folderShareAdd(res.data));

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = res.data.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.FOLDER_SHARING_ADD, `Share a folder [${res.data.name}] on path [${path}] with [${users}]`));
  });
};

export const folderShareRemove = (data) => {
  return {
    type: actionType.FOLDER_SHARING_REMOVE,
    data,
  };
};

export const axiosFolderShareRemove = (user, folder) => (dispatch) => {
  const token = localStorage.getItem('token');
  console.log(`axiosFolderShareRemove user._id='${user._id}', folder._id=${folder._id}`);
  console.log('token=', token);

  axios.put(`http://localhost:3000/folders/share`, {
    user_id: user._id,
    folder_id: folder._id,
  }, {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFolderShareRemove');
    console.log('%%%%%% ', res.data);

    // update state
    dispatch(folderShareRemove({ user_id: user._id, folder_id: folder._id }));

    const email = localStorage.getItem('user_email');
    const re = new RegExp(`./public/uploads/${email}(/?)`);
    const path = folder.path.replace(re, './');

    dispatch(axiosAddActivity(actionType.FOLDER_SHARING_REMOVE, `Remove [${user.email}] share access to folder [${folder.name}] on path [${path}]`));
  });
};

export const fetchShareFolders = (data) => {
  return {
    type: actionType.FETCH_SHARE_FOLDERS,
    data,
  };
};


export const axiosFetchShareFolders = () => (dispatch) => {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/folders/share', {
    headers: {
      token,
    },
  }).then((res) => {
    console.log('--- after axiosFetchShareFolders');
    console.log(res.data);

    dispatch(fetchShareFolders(res.data));
  }).catch((err) => {
    console.log(err);
  });
};
