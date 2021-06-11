import { ADD_AVAILABLE } from "./actionTypes";

//Stefan -- Removed dispatch as proof of concept
export const addAvailable = (user) => {
  //check user against users currently in state AND in team profiles
  // need access to team profile state, so this may need to be done else where
  // or combined with profile state...

  console.log(`ADD_AVAILABLE_ACTION ${user.name}`);
  return {
    type: ADD_AVAILABLE,
    payload: user,
  };
};

export const removeAvailable = (user) => {
  console.log("REMOVE_AVAILABLE ACTION ", user);
};
