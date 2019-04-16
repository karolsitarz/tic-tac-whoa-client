import React, { Component } from 'react';

import Section from '../components/Section';
import Input, { Button } from '../components/Input';
import socket from '../util/socketSetup';
import { connect, changeSection } from '../util/store';
import { getIDfromURL } from '../util/url';

class Login extends Component {
  constructor (props) {
    super(props);
    const { dispatch } = this.props;
    socket.receive('USER_LOGIN_SUCCESS', nickname => {
      dispatch(changeSection('RoomJoin'));
      window.localStorage.nickname = nickname;
      const idURL = getIDfromURL();
      if (idURL != null) socket.comm('USER_JOIN_ROOM', { id: idURL });
    });
  }
  render () {
    return (
      <Section>
        <Input
          initial={window.localStorage.nickname || ''}
          sendValue={v => (this.input = v)}
          maxLength={20}
          placeholder='nickname' />
        <Button
          onClick={e => socket.comm('USER_LOGIN_PROMPT', { username: this.input })}
          primary>
          jump in!
        </Button>
      </Section>
    );
  }
}

export default connect(null)(Login);
