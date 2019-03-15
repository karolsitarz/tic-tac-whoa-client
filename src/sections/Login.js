import React, { Component } from 'react';

import Section from '../components/Section';
import Input, { Button } from '../components/Input';
import socket from '../util/socketSetup';

export default class Login extends Component {
  render () {
    return (
      <Section>
        <Input
          maxLength={20}
          placeholder='nickname' />
        <Button
          onClick={e => socket.comm('xD')}
          primary>
          jump in!
        </Button>
      </Section>
    );
  }
}
