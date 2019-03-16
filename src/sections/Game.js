import React, { Component } from 'react';
import styled from 'styled-components';

import socket from '../util/socketSetup';

import Section from '../components/Section';
import Space from '../components/Space';

const StyledTic = styled.div`
  width: 15vmin;
  height: 15vmin;
  max-width: 3em;
  max-height: 3em;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-color: #eee;
    background-position: center;
    background-size: cover;
    background-image: ${props => props.blue
    ? 'linear-gradient(to right bottom, #48afcc, #6a62cc)'
    : 'linear-gradient(to right bottom, #ff76ad, #ffb58c)'};

    transform: ${props => props.big
    ? 'scale(1)'
    : 'scale(calc(1 / 3 * 2))'};

    border-radius: ${props => props.circle
    ? '50%'
    : '20%'};
  }

  &::after {
    content: "";
    background-color: #fff;
    position: absolute;
    height: 50%;
    width: 50%;
    left: 50%;
    top: 50%;
    display: block;
    border-radius: 50%;
    pointer-events: none;
    transform: ${props => props.flat
    ? 'translate(-50%,-50%) scale(0)'
    : (props.big
      ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(calc(1 / 3 * 2))')}
  }
`;

const Grid = styled.div`
  display: grid;
  place-items: center;
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);
  grid-gap: 1em;
  pointer-events: ${props => props.state === props.wantedState ? 'auto' : ''};
  opacity: ${props => props.state === props.wantedState ? '1' : '0.5'};
  transition: opacity .3s ease;
`;

const StyledGridSpot = styled.div`
  width: 15vmin;
  height: 15vmin;
  max-width: 3em;
  max-height: 3em;
  flex-shrink: 0;
  grid-area: ${props => props.col} / ${props => props.row} / span 1 / span 1;

  &::before {
    content: "";
    position: absolute;
    background-color: #000;
    opacity: 0.08;
    height: 50%;
    width: 50%;
    left: 50%;
    top: 50%;
    display: block;
    border-radius: 50%;
    transform: translate(-50%,-50%);
  }
`;

const GridSpot = ({ pos }) => <StyledGridSpot col={pos % 4 + 1} row={Math.floor(pos / 4 + 1)} onClick={e => socket.comm('GAME_PLACED', pos)} />;
const Tic = props =>
  <StyledTic {...props}
    onClick={e =>
      socket.comm('GAME_PICKED', {
        size: props.big ? 'big' : 'small',
        shape: props.circle ? 'circle' : 'square',
        hole: props.hole ? 'hole' : 'flat',
        color: props.red ? 'red' : 'blue'
      })} />;

export default class Game extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // WAIT - PLACE - PICK
      state: 'WAIT',
      placed: []
    };
    socket.receive('GAME_PLACE', e => this.setState({ state: 'PLACE' }));
    socket.receive('GAME_PICK', e => this.setState({ state: 'PICK' }));
    socket.receive('GAME_WAIT', e => this.setState({ state: 'WAIT' }));

    socket.receive('GAME_PLACED', ({ pos, tic }) => {
      this.setState({ placed: [
        ...this.state.placed,
        <Tic
          style={{
            gridArea: `${pos % 4 + 1} / ${Math.floor(pos / 4 + 1)} / span 1 / span 1`
          }}
          key={pos}
          big={tic.size === 'big'}
          small={tic.size === 'small'}
          circle={tic.shape === 'circle'}
          square={tic.shape === 'square'}
          hole={tic.hole === 'hole'}
          flat={tic.hole === 'flat'}
          red={tic.color === 'red'}
          blue={tic.color === 'blue'} />
      ] });
    });
  }
  render () {
    return (
      <Section>
        <Grid state={this.state.state} wantedState='PLACE'>
          <GridSpot pos={0} />
          <GridSpot pos={1} />
          <GridSpot pos={2} />
          <GridSpot pos={3} />
          <GridSpot pos={4} />
          <GridSpot pos={5} />
          <GridSpot pos={6} />
          <GridSpot pos={7} />
          <GridSpot pos={8} />
          <GridSpot pos={9} />
          <GridSpot pos={10} />
          <GridSpot pos={11} />
          <GridSpot pos={12} />
          <GridSpot pos={13} />
          <GridSpot pos={14} />
          <GridSpot pos={15} />
          {this.state.placed}
        </Grid>
        <Space size={2} />
        <Grid state={this.state.state} wantedState='PICK'>
          <Tic small square red flat />
          <Tic big square red hole />
          <Tic big circle red hole />
          <Tic small circle red flat />
          <Tic small square red hole />
          <Tic big square red flat />
          <Tic big circle red flat />
          <Tic small circle red hole />
          <Tic small square blue hole />
          <Tic big square blue flat />
          <Tic big circle blue flat />
          <Tic small circle blue hole />
          <Tic small square blue flat />
          <Tic big square blue hole />
          <Tic big circle blue hole />
          <Tic small circle blue flat />
        </Grid>
      </Section>
    );
  }
}
