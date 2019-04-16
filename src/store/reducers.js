import { combineReducers } from 'redux';

const sectionReducer = (currentData = 'Login', action) => {
  if (action.type === 'SECTION_CHANGE') {
    if (!action.payload) return currentData;

    return action.payload;
  }
  return currentData;
};

const currentRoomReducer = (currentRoom = '', action) => {
  if (action.type === 'CURRENT_ROOM_CHANGE') {
    if (!action.payload) return currentRoom;

    return action.payload;
  }
  return currentRoom;
};

export default combineReducers({
  section: sectionReducer,
  currentRoom: currentRoomReducer
});
