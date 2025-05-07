import { UPDATE_FORM } from './actions';

const initialState = {
  name: '',
  email: ''
};

export default function formReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FORM:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}