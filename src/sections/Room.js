import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Section from '../components/Section';
import { Button, Or } from '../components/Input';
import socket from '../util/socketSetup';

import Loading from '../components/Loading';
import Space from '../components/Space';

const StyledSpan = styled.span`
  text-transform: uppercase;
  font-size: 0.8em;
  font-weight: bold;
  text-align: center;
`;

const StyledInput = styled.input`
  border: 0;
  padding: 1em;
  text-align: center;
  font-weight: bold;
  background: #f5f5f5;
  border-radius: 5em;
  width: 10em;
  &::selection {
    background: transparent;
  }
  &:hover {
    box-shadow: 0 0 0 5px #8562c83d;
  }
  box-shadow: 0 0 0 2px #c262be00;
  transition: box-shadow .3s ease;
`;

class RoomWait extends Component {
  render () {
    return (
      <Section>
        <Loading />
        <Space size={2} />
        <StyledSpan>waiting for an opponent...</StyledSpan>
        <Space size={1} />
        <Button
          onClick={e => socket.comm('USER_LEAVE_ROOM')}>
          leave
        </Button>
        <Space size={2} />
        <Or text='tap to copy ID/URL' />
        <Space size={1} />
        <StyledInput
          onClick={e => {
            e.target.select();
            document.execCommand('copy');
          }}
          readOnly
          value={this.props.currentRoom} />
        <Space size={0.5} />
        <StyledInput
          onClick={e => {
            e.target.value = window.location.href;
            e.target.select();
            document.execCommand('copy');
          }}
          readOnly
          value={window.location.href} />
      </Section>
    );
  }
}

const mapStateToProps = ({ currentRoom }) => ({ currentRoom });
export default connect(mapStateToProps)(RoomWait);
