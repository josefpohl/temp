import {
  ADD_AVAILABLE,
  LOADING_AVAILABLES,
  SET_CURRENT_AVAILABLES,
} from "../actions/actionTypes";

const initial_state = {
  loadingAvailables: false,
  allAvailables: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_AVAILABLES:
      return { ...state, loadingAvailables: !state.loadingAvailables };
    case SET_CURRENT_AVAILABLES:
      return { ...state, allAvailables: action.payload };
    case ADD_AVAILABLE:
      let newAvailables = [...state.allAvailables, action.payload];
      return { ...state, allAvailables: newAvailables };
    default:
      return state;
  }
};
