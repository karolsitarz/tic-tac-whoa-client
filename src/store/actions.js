export const changeSection = roomName => ({
  type: 'SECTION_CHANGE',
  payload: roomName
});

export const changeCurrentRoom = roomID => ({
  type: 'CURRENT_ROOM_CHANGE',
  payload: roomID
});

export const toggleTheme = () => ({
  type: 'THEME_TOGGLE'
});
