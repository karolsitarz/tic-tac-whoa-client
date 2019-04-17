import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeSection } from '../store/actions';
import screenfull from 'screenfull';
import styled, { keyframes } from 'styled-components';

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
  background-image: linear-gradient(to right, #fc8ca1, #dc64b9, #8c5dc7, #5b80cc);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 2em;
  animation: ${FadeIn} 1s ease backwards;
`;

const FSButton = styled.div`
  position: absolute;
  right: 1em;
  bottom: 1em;
  background: #f7f7f7;
  padding: 0.5em 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1em;
  fill: #b1b1b1;
  box-shadow: 0 0.5em 1em 0 #00000011, 0 0 0 1px #00000005;

  > svg {
    width: .75em;
  }
`;

class Login extends Component {
  constructor (props) {
    super(props);
    socket.receive('USER_LOGIN_SUCCESS', nickname => {
      props.changeSection('RoomJoin');
      window.localStorage.nickname = nickname;
      const idURL = getIDfromURL();
      if (idURL != null) socket.comm('USER_JOIN_ROOM', { id: idURL });
    });
  }
  render () {
    return (
      <Section>
        <Title>tic-tac-wtf</Title>
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
        <FSButton
          onClick={e => screenfull.toggle()}>
          <svg viewBox='0 0 800 800'>
            <path d='M720,320V200A120,120,0,0,0,600,80H480V0H640A160,160,0,0,1,800,160V320H720ZM0,640V480H80V600A120,120,0,0,0,200,720H320v80H160A160,160,0,0,1,0,640ZM80,200V320H0V160A160,160,0,0,1,160,0H320V80H200A120,120,0,0,0,80,200ZM720,600V480h80V640A160,160,0,0,1,640,800H480V720H600A120,120,0,0,0,720,600Z' />
          </svg>
        </FSButton>
      </Section>
    );
  }
}

export default connect(null, { changeSection })(Login);
