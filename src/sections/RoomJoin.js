import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeSection, changeCurrentRoom } from '../store/actions';

import Section from '../components/Section';
import Space from '../components/Space';
import Input, { Button, Or } from '../components/Input';
import socket from '../util/socketSetup';
import setURL from '../util/url';

class RoomJoin extends Component {
  constructor (props) {
    super(props);

    socket.receive('ROOM_WAIT', roomID => {
      props.changeSection('RoomWait');
      props.changeCurrentRoom(roomID);
      setURL(roomID);
    });
    socket.receive('ROOM_ACCEPT', e => props.changeSection('RoomAccept'));
    socket.receive('LEAVE_ROOM', e => {
      props.changeSection('RoomJoin');
      props.changeCurrentRoom('');
      setURL();
    });
    socket.receive('GAME_START', e => props.changeSection('Game'));
  }
  render () {
    return (
      <Section>
        <Input
          sendValue={v => (this.input = v)}
          maxLength={6}
          placeholder='room ID' />
        <Button
          onClick={e => socket.comm('USER_JOIN_ROOM', { id: this.input })}>
          join
        </Button>
        <Space size={2} />
        <Or />
        <Space size={2} />
        <Button
          onClick={e => socket.comm('USER_CREATE_ROOM')}
          primary>
          new game
        </Button>
      </Section>
    );
  }
}

export default connect(null, { changeSection, changeCurrentRoom })(RoomJoin);
