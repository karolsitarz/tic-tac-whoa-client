import React from 'react';
import styled from 'styled-components';

import Section from '../components/Section';
import Space from '../components/Space';
import { Button } from '../components/Input';

const Title = styled.h1`
  background-image: linear-gradient(to right, #fc8ca1, #dc64b9, #8c5dc7, #5b80cc);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 2em;
`;

const Span = styled.span`
  text-align: center;
`;

export default props => (
  <Section>
    <Title>Connection lost:(</Title>
    <Span>Make sure you have a stable internet connection.</Span>
    <Space size={2} />
    <Button
      onClick={e => window.location.reload()}
      primary>
      refresh</Button>
  </Section>
);
