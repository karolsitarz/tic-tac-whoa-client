import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from '../util/store';

import Section from '../components/Section';
import { Button } from '../components/Input';
import socket from '../util/socketSetup';

import Loading from '../components/Loading';
import Space from '../components/Space';

const StyledSpan = styled.span`
  text-transform: uppercase;
  font-size: 0.8em;
  font-weight: bold;
  text-align: center;
`;

class RoomWait extends Component {
  copyInput () {
    this.input.select();
    document.execCommand('copy');
  }
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
        <input
          ref={e => (this.input = e)}
          readOnly
          value={this.props.currentRoom}
          style={{ pointerEvents: 'auto' }} />
        <Button onClick={e => this.copyInput()}>copy</Button>
      </Section>
    );
  }
}

const mapStateToProps = ({ currentRoom }) => ({ currentRoom });
export default connect(mapStateToProps)(RoomWait);
