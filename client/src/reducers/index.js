// ROOT REDUCER
import { combineReducers } from "redux";
import alert from './alert';
import auth from './auth';

export default combineReducers({
  // this variable will be showed up in the Inspect Redux Plugin 
  alert,
  auth
});