import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { changeSection } from './store/actions';
import reducers from './store/reducers';
import socket from './util/socketSetup';
import GlobalStyles from './styles/global-styles';
import Route from './util/Route';
import Login from './sections/Login';
import RoomJoin from './sections/RoomJoin';
import RoomWait from './sections/Room';
import Game from './sections/Game';
import NoConnection from './sections/NoConnection';

const store = createStore(reducers);

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;
`;

socket.onopen = () => {
  // main App
  const App = props => (
    <Provider store={store}>
      <Container>
        <GlobalStyles />
        <Route target={Login} for='Login' />
        <Route target={RoomJoin} for='RoomJoin' />
        <Route target={RoomWait} for='RoomWait' />
        <Route target={Game} for='Game' />
        <Route target={NoConnection} for='NoConnection' />
      </Container>
    </Provider>
  );

  // on close event
  socket.onclose = () => {
    store.dispatch(changeSection('NoConnection'));
    console.error('CONNECTION_CLOSED');
  };

  ReactDOM.render(<App />, document.getElementById('container'));
};

(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
})();
