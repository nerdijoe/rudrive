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
    default:
      return state;
  }
};

export default UserReducer;
