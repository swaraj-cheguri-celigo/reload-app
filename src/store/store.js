import { createStore, combineReducers } from 'redux';
import formReducer from './reducers';

// Combine reducers to namespace state under 'form'
const rootReducer = combineReducers({
  form: formReducer
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;