import * as actionType from '../actions/constants';

const initialState = {
  is_authenticated: false,
  user: {},
  list: [''], // array
  about: {
    overview: '',
    work: '',
    education: '',
    contact_info: '',
    life_events: '',
  },
  interest: {
    music: '',
    shows: '',
    sports: '',
    fav_teams: '',
  },
  files: [],
  folders: [],
  breadcrumb: [],
  shareFiles: [],
  shareFolders: [],
  activities: [],
  signInErrorMsg: '',
  signUpErrorMsg: '',
  signUpSuccessMsg: '',
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.USER_SIGN_IN: {
      // not sure what to do here
      return {
        ...state,
        is_authenticated: true,
      };
    }
    case actionType.SIGN_IN_ERROR: {
      // not sure what to do here
      return {
        ...state,
        signInErrorMsg: action.data.message,
      };
    }
    case actionType.SIGN_IN_ERROR_CLEAR: {
      // not sure what to do here
      return {
        ...state,
        signInErrorMsg: '',
      };
    }
    case actionType.USER_SIGN_UP: {
      return {
        ...state,
        user: {
          firstname: action.data.firstname,
          lastname: action.data.lastname,
          email: action.data.email,
        },
      };
    }
    case actionType.SIGN_UP_ERROR: {
      // not sure what to do here
      return {
        ...state,
        signUpErrorMsg: action.data.message,
      };
    }
    case actionType.SIGN_UP_ERROR_CLEAR: {
      // not sure what to do here
      return {
        ...state,
        signUpErrorMsg: '',
      };
    }
    case actionType.SIGN_UP_SUCCESS: {
      // not sure what to do here
      return {
        ...state,
        signUpSuccessMsg: action.data.message,
      };
    }
    case actionType.SIGN_UP_SUCCESS_CLEAR: {
      // not sure what to do here
      return {
        ...state,
        signUpSuccessMsg: '',
      };
    }
    case actionType.USER_SIGN_OUT: {
      return {
        ...state,
        is_authenticated: false,
      };
    }
    case actionType.FETCH_LISTING: {
      console.log('*** reducer action.list', action);

      return {
        ...state,
        list: action.data,
      };
    }
    case actionType.FETCH_USER_ABOUT: {
      console.log('*** reducer FETCH_USER_ABOUT', action);
      return {
        ...state,
        about: { ...action.data },
      };
    }
    case actionType.UPDATE_USER_ABOUT: {
      console.log('*** reducer UPDATE_USER_ABOUT', action);
      return {
        ...state,
        about: { ...action.data },
      };
    }
    case actionType.FETCH_USER_INTEREST: {
      console.log('*** reducer FETCH_USER_INTEREST', action);
      return {
        ...state,
        interest: { ...action.data },
      };
    }
    case actionType.UPDATE_USER_INTEREST: {
      console.log('*** reducer UPDATE_USER_INTEREST', action);
      return {
        ...state,
        interest: { ...action.data },
      };
    }
    case actionType.FETCH_FILES: {
      console.log('*** reducer FETCH_FILES', action);
      return {
        ...state,
        files: [...action.data.filter(file => file.is_deleted !== true)],
      };
    }
    case actionType.ADD_NEW_FILE: {
      console.log('*** reducer ADD_NEW_FILE');
      const newFile = { ...action.data, Users: [] };

      return {
        ...state,
        files: [...state.files, newFile],
      };
    }
    case actionType.STAR_FILE: {
      console.log('*** reducer STAR_FILE action.data', action.data);
      const updatedFiles = [...state.files];
      const pos = updatedFiles.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        console.log(typeof updatedFiles[pos].is_starred);
        console.log(`--> updatedFiles[${pos}].is_starred=${updatedFiles[pos].is_starred}`);
        // const star_status = (updatedFiles[pos].is_starred == 'true');
        updatedFiles[pos].is_starred = !updatedFiles[pos].is_starred;
      }
      return {
        ...state,
        files: updatedFiles,
      };
    }
    case actionType.DELETE_FILE: {
      console.log('*** reducer DELETE_FILE action.data', action.data);
      const updatedFiles = [...state.files];
      const pos = updatedFiles.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        console.log(typeof updatedFiles[pos].is_deleted);
        console.log(`--> updatedFiles[${pos}].is_deleted=${updatedFiles[pos].is_deleted}`);

        updatedFiles[pos].is_deleted = !updatedFiles[pos].is_deleted;
      }
      return {
        ...state,
        files: updatedFiles,
      };
    }
    case actionType.FETCH_FOLDERS: {
      console.log('*** reducer FETCH_FOLDERS', action);
      return {
        ...state,
        folders: [...action.data.filter(folder => folder.is_deleted !== true )],
      };
    }
    case actionType.ADD_NEW_FOLDER: {
      console.log('*** reducer ADD_NEW_FOLDER');
      const newFolder = { ...action.data, Users: [] };
      return {
        ...state,
        folders: [...state.folders, newFolder],
      };
    }
    case actionType.STAR_FOLDER: {
      console.log('*** reducer STAR_FOLDER action.data', action.data);
      const updatedFolders = [...state.folders];
      const pos = updatedFolders.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        console.log(typeof updatedFolders[pos].is_starred);
        console.log(`--> updatedFolders[${pos}].is_starred=${updatedFolders[pos].is_starred}`);
        // const star_status = (updatedFiles[pos].is_starred == 'true');
        updatedFolders[pos].is_starred = !updatedFolders[pos].is_starred;
      }
      return {
        ...state,
        folders: updatedFolders,
      };
    }
    case actionType.DELETE_FOLDER: {
      console.log('*** reducer DELETE_FOLDER action.data', action.data);
      const updatedFolders = [...state.folders];
      const pos = updatedFolders.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        console.log(typeof updatedFolders[pos].is_deleted);
        console.log(`--> updatedFolders[${pos}].is_deleted=${updatedFolders[pos].is_deleted}`);

        updatedFolders[pos].is_deleted = !updatedFolders[pos].is_deleted;
      }
      return {
        ...state,
        folders: updatedFolders,
      };
    }
    case actionType.FETCH_CONTENTS_BY_FOLDER_ID: {
      console.log('*** reducer FETCH_CONTENTS_BY_FOLDER_ID', action);
      return {
        ...state,
        files: [...action.data.files],
        folders: [...action.data.folders],
      };
    }
    case actionType.BREADCRUMB_PUSH: {
      console.log('*** reducer BREADCRUMB_PUSH', action);

      return {
        ...state,
        breadcrumb: [...state.breadcrumb, action.data],
      };
    }
    case actionType.BREADCRUMB_POP: {
      console.log('*** reducer BREADCRUMB_POP', action);

      let updated = [...state.breadcrumb];
      const pos = updated.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        console.log('updated[pos]=', updated[pos]);
        updated.splice(pos + 1);
      }

      return {
        ...state,
        breadcrumb: updated,
      };
    }
    case actionType.BREADCRUMB_CLEAR: {
      console.log('*** reducer BREADCRUMB_CLEAR', action);

      return {
        ...state,
        breadcrumb: [],
      };
    }
    case actionType.FILE_SHARING_ADD: {
      console.log('*** reducer FILE_SHARING_ADD', action);

      const updatedFiles = [...state.files];
      const pos = updatedFiles.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        // console.log(typeof updatedFiles[pos].is_starred);
        // console.log(`--> updatedFiles[${pos}].is_starred=${updatedFiles[pos].is_starred}`);
        // const star_status = (updatedFiles[pos].is_starred == 'true');
        // updatedFiles[pos].Users = action.data.Users;
        updatedFiles.splice(pos, 1, action.data);
      }
      return {
        ...state,
        files: updatedFiles,
      };
    }
    case actionType.FILE_SHARING_REMOVE: {
      console.log('*** reducer FILE_SHARING_REMOVE', action);

      const updatedFiles = [...state.files];
      const pos = updatedFiles.findIndex(i => i._id === action.data.file_id);
      if (pos !== -1) {
        const userPos = updatedFiles[pos].users.findIndex(user => user._id === action.data.user_id);
        if (userPos !== -1) {
          updatedFiles[pos].users.splice(userPos, 1);
        }
      }

      return {
        ...state,
        files: updatedFiles,
      };
    }
    case actionType.FETCH_SHARE_FILES: {
      console.log('*** reducer FETCH_SHARE_FILES', action);
      return {
        ...state,
        shareFiles: [...action.data.filter(file => file.is_deleted !== true)],
      };
    }
    case actionType.FOLDER_SHARING_ADD: {
      console.log('*** reducer FOLDER_SHARING_ADD', action);

      const updatedFolders = [...state.folders];
      const pos = updatedFolders.findIndex(i => i._id === action.data._id);
      if (pos !== -1) {
        updatedFolders.splice(pos, 1, action.data);
      }
      return {
        ...state,
        folders: updatedFolders,
      };
    }
    case actionType.FOLDER_SHARING_REMOVE: {
      console.log('*** reducer FOLDER_SHARING_REMOVE', action);

      const updatedFolders = [...state.folders];
      const pos = updatedFolders.findIndex(i => i._id === action.data.folder_id);
      if (pos !== -1) {
        const userPos = updatedFolders[pos].users.findIndex(user => user._id === action.data.user_id);
        if (userPos !== -1) {
          updatedFolders[pos].users.splice(userPos, 1);
        }
      }

      return {
        ...state,
        folders: updatedFolders,
      };
    }
    case actionType.FETCH_SHARE_FOLDERS: {
      console.log('*** reducer FETCH_SHARE_FOLDERS', action);
      return {
        ...state,
        shareFolders: [...action.data.filter(folder => folder.is_deleted !== true)],
      };
    }
    case actionType.FETCH_ACTIVITIES: {
      console.log('*** reducer FETCH_ACTIVITIES', action);
      return {
        ...state,
        activities: [...action.data],
      };
    }
    case actionType.ADD_ACTIVITY: {
      console.log('*** reducer ADD_ACTIVITY', action);
      return {
        ...state,
        activities: [...state.activities, action.data],
      };
    }
    default:
      return state;
  }
};

export default UserReducer;
