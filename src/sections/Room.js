import React, { Component } from 'react';

import Section from '../components/Section';
import { Button } from '../components/Input';
import socket from '../util/socketSetup';

import Loading from '../components/Loading';
import Space from '../components/Space';

export class RoomWait extends Component {
  render () {
    return (
      <Section>
        <Loading />
        <Space size={2} />
        waiting for an opponent...
        <Space size={1} />
        <Button
          onClick={e => socket.comm('USER_LEAVE_ROOM')}>
          leave
        </Button>
      </Section>
    );
  }
}
