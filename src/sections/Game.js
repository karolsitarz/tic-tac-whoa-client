import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import socket from '../util/socketSetup';

import Section from '../components/Section';
import { Button } from '../components/Input';
import Space from '../components/Space';

const ticFadeIn = keyframes`
  from {
    opacity: 0.5;
    transform: scale(0);
  }
`;

const StyledTic = styled.div`
  width: 15vmin;
  height: 15vmin;
  max-width: 3em;
  max-height: 3em;
  flex-shrink: 0;
  opacity: ${props => props.disabled ? '0.1' : '1'};
  pointer-events: ${props => props.disabled ? 'none' : ''};
  transition: opacity .3s ease;
  opacity: ${props => props.current === true ? '1' : ''};
  animation: ${ticFadeIn} .2s ease backwards;

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
    box-shadow: ${props => props.current === true
    ? props => props.red
      ? '0 0 0 0.35em #ff969c88'
      : '0 0 0 0.35em #5988cc88'
    : '0 0 0 0 #fff8'};
    transition: box-shadow .3s ease;

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
  pointer-events: ${props => props.currentState === props.wantedState ? 'auto' : ''};
  opacity: ${props => props.currentState === props.wantedState ? '1' : '0.5'};
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

const GridSpot = ({ pos, setPickedPos }) => <StyledGridSpot col={pos % 4 + 1} row={Math.floor(pos / 4 + 1)} onClick={e => setPickedPos(pos)} />;

const Tic = props =>
  <StyledTic {...props}
    onClick={e => {
      if (!props.setPickedTic) return;
      props.setPickedTic({
        size: props.big ? 'big' : 'small',
        shape: props.circle ? 'circle' : 'square',
        hole: props.hole ? 'hole' : 'flat',
        color: props.red ? 'red' : 'blue'
      });
    }} />;

const StyledSpan = styled.span`
  text-transform: uppercase;
  font-size: 0.8em;
  font-weight: bold;
  text-align: center;
`;

export default class Game extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // WAIT - PLACE - PICK
      state: 'WAIT',
      pickedTic: null,
      pickedPos: null,
      placed: [],
      textNo: 0,
      tics: [
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'ssrf'} small square red flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bsrh'} big square red hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bcrh'} big circle red hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'scrf'} small circle red flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'ssrh'} small square red hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bsrf'} big square red flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bcrf'} big circle red flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'scrh'} small circle red hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'ssbh'} small square blue hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bsbf'} big square blue flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bcbf'} big circle blue flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'scbh'} small circle blue hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'ssbf'} small square blue flat />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bsbh'} big square blue hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'bcbh'} big circle blue hole />,
        <Tic setPickedTic={v => this.setPickedTic(v)} key={'scbf'} small circle blue flat />
      ]
    };
    socket.receive('GAME_PLACE', e => this.setState({ state: 'PLACE', textNo: 1 }));
    socket.receive('GAME_PICK', e => this.setState({ state: 'PICK', textNo: 2 }));
    socket.receive('GAME_WAIT', e => this.setState({ state: 'WAIT', textNo: 3 }));

    socket.receive('GAME_PLACED', ({ pos, tic }) => {
      if (this.state.textNo === 3) this.setState({ textNo: 0 });
      this.setState({
        placed: [
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
        ]
      });

      const newTics = [...this.state.tics];
      const i = newTics.findIndex(tic => {
        if (tic.props.current !== true) return false;
        return true;
      });
      if (i === -1) return;

      newTics[i] = React.cloneElement(newTics[i], { ...newTics[i].props, current: undefined });
      this.setState({ tics: newTics });
    });
    socket.receive('GAME_PICKED', data => {
      this.setState({ pickedTic: null });
      const placedTic = data.tic;
      const newTics = [...this.state.tics];
      const i = newTics.findIndex(tic => {
        if (tic.props.disabled) return false;
        if (!(placedTic.size in tic.props)) return false;
        if (!(placedTic.shape in tic.props)) return false;
        if (!(placedTic.hole in tic.props)) return false;
        if (!(placedTic.color in tic.props)) return false;
        return true;
      });
      if (i === -1) return;

      newTics[i] = React.cloneElement(newTics[i], { ...newTics[i].props, disabled: true, current: true });
      this.setState({ tics: newTics });
    });
  }
  render () {
    return (
      <Section>
        <Grid currentState={this.state.state} wantedState='PLACE'>
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={0} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={1} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={2} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={3} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={4} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={5} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={6} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={7} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={8} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={9} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={10} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={11} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={12} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={13} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={14} />
          <GridSpot setPickedPos={v => this.setPickedPos(v)} pos={15} />
          {this.state.placed}
        </Grid>
        <Space size={2} />
        <StyledSpan>
          {['the opponent is choosing a tic for you', 'place your tic', 'pick the tic for your opponent', 'the opponent is placing his tic'][this.state.textNo]}
        </StyledSpan>
        <Space size={1} />
        <Button>lol i won</Button>
        <Button primary onClick={e => this.endRound()}>ok</Button>
        <Space size={2} />
        <Grid
          currentState={this.state.state}
          wantedState='PICK'>
          {this.state.tics}
        </Grid>
      </Section>
    );
  }
  endRound () {
    if (this.state.state === 'PICK' && this.state.pickedTic != null) {
      socket.comm('GAME_PICKED', this.state.pickedTic);
    } else if (this.state.state === 'PLACE' && this.state.pickedPos != null) {
      socket.comm('GAME_PLACED', this.state.pickedPos);
    }
  }
  setPickedTic (data) {
    if (this.state.state !== 'PICK') return;
    this.setState({ pickedTic: data });

    const placedTic = data;
    const newTics = [...this.state.tics];
    const current = newTics.findIndex(tic => {
      if (tic.props.current) return true;
      return false;
    });

    const i = newTics.findIndex(tic => {
      if (tic.props.disabled) return false;
      if (!(placedTic.size in tic.props)) return false;
      if (!(placedTic.shape in tic.props)) return false;
      if (!(placedTic.hole in tic.props)) return false;
      if (!(placedTic.color in tic.props)) return false;
      return true;
    });
    if (i === -1) return;

    if (current !== -1) newTics[current] = React.cloneElement(newTics[current], { ...newTics[current].props, disabled: false, current: false });
    newTics[i] = React.cloneElement(newTics[i], { ...newTics[i].props, disabled: true, current: true });
    this.setState({ tics: newTics });
  }

  setPickedPos (pos) {
    this.setState({ pickedPos: pos });
  }
}
