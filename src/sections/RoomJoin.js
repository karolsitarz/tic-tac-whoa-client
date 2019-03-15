import React, { Component } from 'react';

import Section from '../components/Section';
import Input, { Button, Or } from '../components/Input';
import socket from '../util/socketSetup';
import Consumer from '../util/Context';

export default class RoomJoin extends Component {
  render () {
    return (
      <Section>
        <Button
          onClick={e => socket.comm('USER_CREATE_ROOM')}
          primary>
          start a new game
        </Button>
        <Or />
        <Input
          sendValue={v => (this.input = v)}
          maxLength={32}
          placeholder='room ID' />
        <Button
          onClick={e => socket.comm('USER_JOIN_ROOM', { id: this.input })}>
          join
        </Button>

        <Consumer>{context => <TransparentEvent context={context} />}</Consumer>
      </Section>
    );
  }
}
class TransparentEvent extends Component {
  constructor (props) {
    super(props);
    socket.receive('ROOM_JOIN', e => this.props.context.changeSection('Room'));
  }
  render () {
    return <React.Fragment />;
  }
}
