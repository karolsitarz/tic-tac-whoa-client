import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import socket from '../util/socketSetup';

import Section from '../components/Section';
import { Button } from '../components/Input';
import Space from '../components/Space';

const ticFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
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
      ? '0 0 0 0.5em #ff969c88'
      : '0 0 0 0.5em #5988cc88'
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
      ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(calc(1 / 3 * 2))')};
    box-shadow: ${props => props.current === true
    ? props => props.red
      ? '0 0 0 0.35em #ff969c88 inset'
      : '0 0 0 0.35em #5988cc88 inset'
    : '0 0 0 0 #fff8 inset'};
    transition: box-shadow .3s ease;
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

const GridSpot = ({ pos, setPickedPos }) => <StyledGridSpot col={Math.floor(pos / 4 + 1)} row={pos % 4 + 1} onClick={e => setPickedPos(pos)} />;

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
  padding: 0 1em;
`;

//

const BottomCard = styled.section`
  background: #f5f5f5;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 3em 0;
  border-radius: 2em 2em 0 0;
  box-shadow: 0 0 2em #0000002e;
`;

const FixedSection = styled.section`
  min-height: calc(100vh - 4em);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  pointer-events: none;
`;

const BlankFixedSection = styled.section`
  min-height: calc(100vh - 4em);
  width: 100%;
`;

//

const ModalContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: ${props => props.active ? 'all' : 'none'};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #0003;
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity .3s ease;
  }
`;

const WinningModal = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  margin: 1em;
  padding: 2em 1em;
  border-radius: 2em;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition:
    opacity .3s ease,
    transform .3s ease;
  opacity: ${props => props.active ? '1' : '0'};
  transform: ${props => props.active
    ? 'translate3d(0,0,0)'
    : 'translate3d(0,calc(100% + 1em),0)'};
`;

const EndGameModal = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  margin: 1em;
  padding: 2em 0;
  border-radius: 2em;
  position: absolute;
  left: calc(50% - 1em);
  top: 50%;
  width: calc(100% - 2em);
  transition:
    opacity .3s ease,
    transform .3s ease;
  opacity: ${props => props.active ? '1' : '0'};
  transform: ${props => props.active
    ? 'translate(-50%, -50%) scale(1)'
    : 'translate(-50%, -50%) scale(0)'};
`;

//

const IconButton = styled.div`
  &::after {
    content: "";
    display: block;
    padding-bottom: calc(8000% / 88);
    pointer-events: none;
  }
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: calc(880% / 8);
    left: 50%;
    top: 50%;
    position: absolute;
    background-color: #00000008;
    transition: transform .3s ease, opacity .3s ease;
    border-radius: 50%;
    pointer-events: none;
    transform: ${props => props.type === props.stateType
    ? 'translate(-50%, -50%) scale(1.1)'
    : 'translate(-50%, -50%) scale(0)'};
    opacity: ${props => props.type === props.stateType ? '1' : '0'};
  }
  > svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 65%;
    height: 65%;
    pointer-events: none;
    fill: #e4e4e4;
  }
  width: 20%;
  max-height: 100px;  
`;

const IconButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

export default class Game extends Component {
  constructor (props) {
    super(props);
    this.hasPlaced = false;
    this.state = {
      // WAIT - PLACE - PICK
      state: 'WAIT',
      pickedTic: null,
      pickedPos: null,
      winning: false,
      end: 0,
      pickedType: null,
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
    socket.receive('GAME_PLACE', e => {
      this.setState({ state: 'PLACE', textNo: 1 });
      if (!this.hasPlaced) this.hasPlaced = true;
    });
    socket.receive('GAME_PICK', e => {
      this.setState({ state: 'PICK', textNo: 2 });
      if (this.hasPlaced) this.BottomCard.scrollIntoView({ behavior: 'smooth' });
    });
    socket.receive('GAME_WAIT', e => this.setState({ state: 'WAIT', textNo: 3 }));

    socket.receive('GAME_PLACED', ({ pos, tic }) => {
      this.setState({ pickedTic: null });
      if (this.state.textNo === 3) this.setState({ textNo: 0 });
      const placed = [...this.state.placed];
      placed[placed.length - 1] =
        (
          <Tic
            style={{
              gridArea: `${Math.floor(pos / 4 + 1)} / ${pos % 4 + 1} / span 1 / span 1`
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
        );
      this.setState({ placed });

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
      this.setState({
        pickedTic: data.tic,
        pickedPos: null,
        placed: [...this.state.placed, null]
      });
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

    socket.receive('GAME_END_WIN', data => {
      this.setState({ end: 2, winning: false });
    });
    socket.receive('GAME_END_LOSE', data => {
      this.setState({ end: 1, winning: false });
    });
    socket.receive('GAME_END_DRAW', data => {
      this.setState({ end: 3, winning: false });
    });
    socket.receive('GAME_DRAW_WAIT', e => {
      this.setState({ state: 'PLACE', textNo: 4 });
      if (!this.hasPlaced) this.hasPlaced = true;
    });
  }
  render () {
    return (
      <Section>
        <BlankFixedSection />
        <FixedSection>
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
            {['the opponent is choosing a tic for you', 'place your tic', 'pick the tic for your opponent', 'the opponent is placing his tic', 'find the winning combination!'][this.state.textNo]}
          </StyledSpan>
          <Space size={1} />
          <Button
            hidden={this.state.state === 'WAIT'}
            primary
            onClick={e => this.endRound()}>ok</Button>
          <Button
            hidden={this.state.state === 'WAIT' && this.state.textNo !== 4}
            onClick={e => this.openWinning()}>I won</Button>
        </FixedSection>
        <BottomCard ref={ref => (this.BottomCard = ref)}>
          <Grid
            currentState={this.state.state}
            wantedState='PICK'>
            {this.state.tics}
          </Grid>
        </BottomCard>
        <ModalContainer active={this.state.winning}>
          <WinningModal active={this.state.winning}>
            <StyledSpan>pick the type of winning tics</StyledSpan>
            <Space size={1} />
            <IconButtonContainer>
              <IconButton
                onClick={e => this.setState({ pickedType: 'color' })}
                type='color'
                stateType={this.state.pickedType}>
                <svg viewBox='0 0 880 800'>
                  <path d='M160,800A160,160,0,0,1,0,640V160A160,160,0,0,1,160,0H400V800H160Z' />
                  <path style={{ fill: '#bbb' }} d='M879,142.119V657.881A160.015,160.015,0,0,1,720,800H480V0H720A160.016,160.016,0,0,1,879,142.119Z' />
                </svg>
              </IconButton>
              <IconButton
                onClick={e => this.setState({ pickedType: 'hole' })}
                type='hole'
                stateType={this.state.pickedType}>
                <svg viewBox='0 0 880 800'>
                  <path d='M160,800A160,160,0,0,1,0,640V160A160,160,0,0,1,160,0H400V800H160Z' />
                  <path d='M720, 800H480V600c110.457,0,200-89.543,200-200S590.457,200,480,200V0H720A160.016,160.016,0,0,1,879,142.119V657.881A160.015,160.015,0,0,1,720,800Z' />
                </svg>
              </IconButton>
              <IconButton
                onClick={e => this.setState({ pickedType: 'shape' })}
                type='shape'
                stateType={this.state.pickedType}>
                <svg viewBox='0 0 880 800'>
                  <path d='M160,800A160,160,0,0,1,0,640V160A160,160,0,0,1,160,0H400V800H160Z' />
                  <path d='M480,800V0C700.914,0,880,179.086,880,400S700.914,800,480,800Z' />
                </svg>
              </IconButton>
              <IconButton
                onClick={e => this.setState({ pickedType: 'size' })}
                type='size'
                stateType={this.state.pickedType}>
                <svg viewBox='0 0 880 800'>
                  <path d='M160,800A160,160,0,0,1,0,640V160A160,160,0,0,1,160,0H400V800H160Z' />
                  <path d='M745.973,228.1V571.9A106.667,106.667,0,0,1,639.984,666.64H480V133.36H639.984A106.667,106.667,0,0,1,745.973,228.1Z' />
                </svg>
              </IconButton>
            </IconButtonContainer>
            <Space size={1} />
            <Button primary onClick={e => this.winning(this.state.pickedType)}>ok</Button>
            <Button onClick={e => this.closeWinning()}>cancel</Button>
            <Space size={1} />
            <span style={{ textAlign: 'center', fontSize: '0.8em' }}><b>Careful!</b> Choosing wrong <b>WILL</b> result in losing the game!</span>
          </WinningModal>
        </ModalContainer>
        <ModalContainer active={this.state.end}>
          <EndGameModal active={this.state.end}>
            <h2>{['', 'You lost! :(', 'You won! :D', 'You tied!'][this.state.end]}</h2>
            <span>{['', 'Too bad! Better luck next time!', 'Great job! You did awesome!', 'Great minds think alike!'][this.state.end]}</span>
            <Space size={1} />
            <Button primary onClick={e => socket.comm('USER_LEAVE_ROOM')}>leave</Button>
          </EndGameModal>
        </ModalContainer>
      </Section>
    );
  }
  endRound () {
    if (this.state.end !== 0) return;
    if (this.state.winning) return;

    if (this.state.state === 'PICK' && this.state.pickedTic != null) {
      socket.comm('GAME_PICKED', this.state.pickedTic);
    } else if (this.state.state === 'PLACE' && this.state.pickedPos != null && this.state.textNo !== 4) {
      socket.comm('GAME_PLACED', this.state.pickedPos);
    }
  }
  setPickedTic (data) {
    if (this.state.end !== 0) return;
    if (this.state.state !== 'PICK') return;
    if (this.state.winning !== false) return;
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
    if (this.state.end !== 0) return;
    if (this.state.state !== 'PLACE') return;
    if (this.state.winning !== false) return;
    this.setState({ pickedPos: pos });

    const tic = this.state.pickedTic;
    const placed = [...this.state.placed];
    placed[placed.length - 1] =
      (
        <Tic
          style={{
            gridArea: `${Math.floor(pos / 4 + 1)} / ${pos % 4 + 1} / span 1 / span 1`
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
      );
    this.setState({ placed: placed });
  }

  winning (type) {
    if (this.state.end !== 0) return;
    if (!this.state.winning) return;
    if (this.state.pickedType !== 'shape' && this.state.pickedType !== 'size' && this.state.pickedType !== 'hole' && this.state.pickedType !== 'color') return;

    // jesli ma jakas postawiona
    if (this.state.state === 'PLACE' && this.state.pickedPos != null) {
      socket.comm('GAME_WIN_PLACED', {
        type,
        tic: this.state.pickedTic,
        pos: this.state.pickedPos
      });
    } else {
      socket.comm('GAME_WIN', type);
    }
  }

  openWinning () {
    if (this.state.end !== 0) return;
    if (this.state.state !== 'PICK' && this.state.state !== 'PLACE') return;

    this.setState({ winning: true, pickedType: null });
  }
  closeWinning () {
    if (this.state.end !== 0) return;
    this.setState({ winning: false, pickedType: null });
  }
}
