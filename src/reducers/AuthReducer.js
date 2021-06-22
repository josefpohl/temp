import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,
  USER_LOADING,
  USER_LOADING_COMPLETE,
  LOGOUT_USER,
} from "../actions/actionTypes";

const initial_state = {
  email: "",
  password: "",
  user: null,
  isAuthenticated: false,
  error: "",
  loading: false,
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.payload };
    case LOGIN_USER_FAIL:
      const message = !action.payload
        ? ""
        : action.payload.user
        ? "Login failure. Please check your user name and password."
        : "Please check the network access";
      return { ...state, isAuthenticated: false, error: message };
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case USER_LOADING:
      return { ...state, loading: true };
    case USER_LOADING_COMPLETE:
      return { ...state, loading: false };
    case LOGOUT_USER:
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};
