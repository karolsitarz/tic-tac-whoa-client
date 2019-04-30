import React from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';

import GlobalStyles from './styles/globalStyles';
import theme from './styles/theme';

import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { changeSection } from './store/actions';
import reducers from './store/reducers';

import socket from './util/socketSetup';
import NoConnection from './sections/NoConnection';

import Route from './util/Route';
import Login from './sections/Login';
import RoomJoin from './sections/RoomJoin';
import RoomWait from './sections/Room';
import Game from './sections/Game';

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
    <ThemeProvider theme={theme[props.theme]}>
      <Container>
        <GlobalStyles />
        <Route target={Login} for='Login' />
        <Route target={RoomJoin} for='RoomJoin' />
        <Route target={RoomWait} for='RoomWait' />
        <Route target={Game} for='Game' />
        <Route target={NoConnection} for='NoConnection' />
      </Container>
    </ThemeProvider>
  );
  const AppWithProps = connect(({ theme }) => ({ theme }))(App);

  const Wrapper = props => (
    <Provider store={store}>
      <AppWithProps />
    </Provider>
  );

  // on close event
  socket.onclose = () => {
    store.dispatch(changeSection('NoConnection'));
    console.error('CONNECTION_CLOSED');
  };

  ReactDOM.render(<Wrapper />, document.getElementById('container'));
};

(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
})();
