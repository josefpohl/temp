import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";
import socketMiddleware from "./socketio/middleware/socketMiddleware";
import SocketClient from "./socketio/SocketClient";

const socketClient = new SocketClient();

const middleware = [thunk, socketMiddleware(socketClient), logger];
const initialState = {};

store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);

export default store;
