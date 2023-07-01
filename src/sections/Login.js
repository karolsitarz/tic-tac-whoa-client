import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeSection, toggleTheme } from '../store/actions';
import styled, { keyframes } from 'styled-components';
import ping from '../util/pingSocket';

import Section from '../components/Section';
import Space from '../components/Space';
import Input, { Button } from '../components/Input';
import socket from '../util/socketSetup';
import { getIDfromURL } from '../util/url';

const FadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0,.5em,0);
  }
`;

const Title = styled.h1`
  background-image: linear-gradient(to right, ${props => props.theme.gradient});
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 2em;
  animation: ${FadeIn} 1s ease backwards;
`;

class Login extends Component {
  constructor (props) {
    super(props);
    socket.receive('USER_LOGIN_SUCCESS', nickname => {
      props.changeSection('RoomJoin');
      window.localStorage.nickname = nickname;
      const idURL = getIDfromURL();
      if (idURL != null) socket.comm('USER_JOIN_ROOM', { id: idURL });

      ping(socket);
    });
  }
  render () {
    return (
      <Section>
        <Title>tic-tac-whoa</Title>
        <Space size={5} />
        <Input
          initial={window.localStorage.nickname || ''}
          sendValue={v => (this.input = v)}
          maxLength={20}
          placeholder='nickname' />
        <Button
          onClick={e => socket.comm('USER_LOGIN_PROMPT', { username: this.input })}
          primary>
          jump in!</Button>
        <Button
          onClick={e => this.props.toggleTheme()} >
          toggle theme</Button>
      </Section>
    );
  }
}

export default connect(null, { changeSection, toggleTheme })(Login);
