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

const theme = theme => {
  if (theme == null) return window.localStorage.theme;
  else window.localStorage.theme = theme;
};

const themeReducer = (currentTheme = (theme() != null ? theme() : 'light'), action) => {
  if (action.type === 'THEME_TOGGLE') {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    theme(newTheme);
    return newTheme;
  }
  return currentTheme;
};

export default combineReducers({
  section: sectionReducer,
  currentRoom: currentRoomReducer,
  theme: themeReducer
});
