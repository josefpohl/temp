import {
  ADD_AVAILABLE,
  LOADING_AVAILABILITY,
  SET_CURRENT_AVAILABLES,
  REMOVE_AVAILABLE,
  LEFT_LIVE_CALL,
  IN_LIVE_CALL,
} from "../actions/actionTypes";

const initial_state = {
  loadingAvailables: false,
  allAvailables: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_AVAILABILITY:
      console.log(`LOADING_AVAILABILITY: `);
      return { ...state, loadingAvailables: !state.loadingAvailables };
    case SET_CURRENT_AVAILABLES:
      console.log(`SET CURRENT AVAILABLES ${JSON.stringify(action.payload)}`);
      return { ...state, allAvailables: action.payload };
    case ADD_AVAILABLE:
      console.log(`ADD_AVAILABLE ${JSON.stringify(action.payload.name)}`);
      const addId = getId(action.payload);
      let indexToAdd = state.allAvailables.findIndex(
        (a) => getId(a.userLoggedIn) === addId
      );
      let newAvailablesAdd = [];
      if (indexToAdd >= 0) {
        // person in there
        let newAvailablesAdd = state.allAvailables;
        newAvailablesAdd.splice(index, 1, action.payload.available);
      } else {
        newAvailablesAdd = [...state.allAvailables, action.payload.available];
      }
      return {
        ...state,
        allAvailables: newAvailablesAdd,
        updatingAvailables: true,
      };
    case REMOVE_AVAILABLE:
      const id = getId(action.payload);
      let index = state.allAvailables.findIndex(
        (a) => getId(a.userLoggedIn) === id
      );
      let newAvailablesDisco = state.allAvailables;
      newAvailablesDisco.splice(index, 1);

      return {
        ...state,
        allAvailables: [...newAvailablesDisco],
      };
    case LEFT_LIVE_CALL:
      console.log(`Available LEFT Reducer ${JSON.stringify(action.payload)}`);
      if (action.payload === null || action.payload?.role !== "skywriter")
        return state;
      const idLLC = getId(action.payload);
      let indexLLC = state.allAvailables.findIndex(
        (a) => getId(a.userLoggedIn) === idLLC
      );
      let newAvailLLC = state.allAvailables[indexLLC];
      newAvailLLC.isAvailable = true;
      newAvailLLC.inLiveCall = false;
      let newAvailablesLLC = state.allAvailables;
      newAvailablesLLC.splice(indexLLC, 1, newAvailLLC);
      return {
        ...state,
        allAvailables: [...newAvailablesLLC],
      };
    case IN_LIVE_CALL:
      console.log(`Available IN Reducer ${JSON.stringify(action.payload)}`);
      if (action.payload === null || action.payload?.role !== "skywriter")
        return state;
      const idILC = getId(action.payload);
      let indexILC = state.allAvailables.findIndex(
        (a) => getId(a.userLoggedIn) === idILC
      );
      let newAvail = state.allAvailables[indexILC];
      newAvail.isAvailable = false;
      newAvail.inLiveCall = true;
      let newAvailablesILC = state.allAvailables;
      newAvailablesILC.splice(indexILC, 1, newAvail);
      return {
        ...state,
        allAvailables: [...newAvailablesILC],
      };
    default:
      return state;
  }
};

function getId(user) {
  if (user.id) {
    console.log("GET ID", user.id);
    return user.id;
  } else {
    console.log("GET ID", user._id);
    return user._id;
  }
}
