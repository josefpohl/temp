import { 
  SHOW_SOCKET_LOADING,
  SHOW_SOCKET_RECONNECT,
  SHOW_SOCKET_FAILED,
  HIDE_SOCKET_LOADING
} from "./actionTypes";

export const showSocketLoading = () => {
  return { type: SHOW_SOCKET_LOADING };
};

export const showSocketReconnect = () => {
  return { type: SHOW_SOCKET_RECONNECT };
};

export const showSocketFailed= () => {
  return { type: SHOW_SOCKET_FAILED };
};

export const hideSocketLoading = () => {
  return { type: HIDE_SOCKET_LOADING };
};