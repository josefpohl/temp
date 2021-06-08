import { ADD_AVAILABLE } from "./actionTypes";

//Stefan -- Removed dispatch as proof of concept
export const addAvailable = (user) => {
  //(dispatch) => {

  //check user against users currently in state AND in team profiles
  // need access to team profile state, so this may need to be done else where
  // or combined with profile state...

  console.log(`ADD_AVAILABLE_ACTION ${user.name}`);
  //   dispatch({
  //     type: ADD_AVAILABLE,
  //     payload: user,
  //   });
};
