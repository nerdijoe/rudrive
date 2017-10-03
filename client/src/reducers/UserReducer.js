import * as actionType from '../actions/constants';

const initialState = {};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.USER_SIGN_IN: {
      // not sure what to do here
      return state;
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
    default:
      return state;
  }
};

export default UserReducer;
