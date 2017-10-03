import * as actionType from '../actions/constants';

const initialState = {
  is_authenticated: false,
  user: {}
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
        }
      };
    }
    case actionType.USER_SIGN_OUT: {
      return {
        ...state,
        is_authenticated: false,
      }
    }
    default:
      return state;
  }
};

export default UserReducer;
