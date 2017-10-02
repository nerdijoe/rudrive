import * as actionType from '../actions/constants';

const initialState = {};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.USER_SIGN_IN: {
      // not sure what to do here
      return state;
    }
  }
};

export default UserReducer;
