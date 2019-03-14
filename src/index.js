import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { ProviderSetup } from './util/Context';
import GlobalStyles from './styles/global-styles';
// import Route from './util/Route';

const socket = new window.WebSocket(`ws://${window.location.hostname}:443`);

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

socket.onopen = () => {
  // main App
  const App = props => (
    <ProviderSetup socket={socket}>
      <Container>
        <GlobalStyles />
        siemanko
        {/* <Route for='Login' target={Login} /> */}
      </Container>
    </ProviderSetup>
  );

  // on close event
  socket.onclose = () => {};

  ReactDOM.render(<App />, document.getElementById('container'));
};
