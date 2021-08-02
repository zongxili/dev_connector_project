// ROOT REDUCER
import { combineReducers } from "redux";
import alert from './alert';

export default combineReducers({
  // this variable will be showed up in the Inspect Redux Plugin 
  alert
});