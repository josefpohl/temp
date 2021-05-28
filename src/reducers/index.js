import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import ProfileReducer from "./ProfileReducer";
import AvailableReducer from "./AvailableReducer";
import JobsReducer from "./JobsReducer";

export default combineReducers({
  auth: AuthReducer,
  profiles: ProfileReducer,
  availables: AvailableReducer,
  jobs: JobsReducer,
});
