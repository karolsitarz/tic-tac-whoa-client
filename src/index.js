import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Provider } from './util/store';
import socket from './util/socketSetup';
import GlobalStyles from './styles/global-styles';
import Route from './util/Route';
import Login from './sections/Login';
import RoomJoin from './sections/RoomJoin';
import { RoomWait } from './sections/Room';

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

socket.onopen = () => {
  // main App
  const App = props => (
    <Provider>
      <Container>
        <GlobalStyles />
        <Route target={Login} />
        <Route target={RoomJoin} />
        <Route target={RoomWait} />
      </Container>
    </Provider>
  );

  // on close event
  socket.onclose = () => {};

  ReactDOM.render(<App />, document.getElementById('container'));
};
