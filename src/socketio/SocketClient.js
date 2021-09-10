import io from "socket.io-client";
import config from "../config";

const host = config.SERVER;

export default class socketAPI {
  socket;

  async connect() {
    this.socket = io.connect(host, {
      reconnection: true,
      reconnectionDelay: 10000,
      reconnectionDelayMax: 60000,
      reconnectionAttempts: "Infinity",
      //timeout: 10000,
      transports: ["websocket"],
    });
    return new Promise((resolve, reject) => {
      this.socket.on("connect", () => resolve());
      this.socket.on("connect_error", (error) => reject(error));
    });
  }

  async disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve();
      });
    });
  }

  async emit(event, data) {
    return new Promise((resolve, reject) => {
      // if (!this.socket) return reject("No socket connection.");

      //We could have a more gracious reconnection flow here maybe with userconnected action also
      if (!this.socket) {
        console.log("No Socket!!!");
        this.connect()
          .then(() => {
            console.log("reconnecting and now emitting", event);
            this.emit(event, data);
          })
          .catch((err) => {
            console.error(err);
            return reject("No socket connection could be established");
          });
      }
      return this.socket.emit(event, data, (response) => {
        // Response is the optional callback that you can use with socket.io in every request. See 1 above.
        console.log("emit response", response);
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }

        return resolve();
      });
    });
  }

  on(event, fun) {
    // No promise is needed here, but we're expecting one in the middleware.
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject("No socket connection.");

      this.socket.on(event, fun);
      resolve();
    });
  }
  off(event) {
    // No promise is needed here, but we're expecting one in the middleware.
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject("No socket connection.");

      this.socket.off(event);
      resolve();
    });
  }
}
