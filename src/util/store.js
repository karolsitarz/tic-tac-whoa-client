import { createStore } from 'react-context-redux';

const store = createStore({
  section: 'Login',
  currentRoom: ''
});
export const { Provider } = store;

export const connect = state => component => {
  const passedState = state === null ? () => {} : state;
  const connect = store.connect(passedState)(component);
  connect.route = component.name;
  return connect;
};

export const changeSection = section => dispatch => {
  dispatch({
    key: 'section',
    payload: section
  });
};
