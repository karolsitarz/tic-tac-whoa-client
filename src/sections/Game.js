import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import socket from '../util/socketSetup';

import Section from '../components/Section';
import { Button } from '../components/Input';
import Space from '../components/Space';

const blockFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
`;

const StyledBlock = styled.div`
  width: 15vmin;
  height: 15vmin;
  max-width: 3em;
  max-height: 3em;
  flex-shrink: 0;
  opacity: ${props => props.disabled ? '0.1' : '1'};
  pointer-events: ${props => props.disabled ? 'none' : ''};
  transition: opacity .3s ease;
  opacity: ${props => props.current === true ? '1' : ''};
  animation: ${blockFadeIn} .2s ease backwards;
  opacity: ${props => props.winning ? '1 !important' : ''};

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-position: center;
    background-size: cover;
    background-image: ${props => props.blue
    ? `linear-gradient(to right bottom, ${props.theme.blueGradient})`
    : `linear-gradient(to right bottom, ${props.theme.redGradient})`};
    box-shadow: ${props => props.current === true
    ? props => props.blue
      ? `0 0 0 0.4em ${props.theme.blue}88`
      : `0 0 0 0.4em ${props.theme.red}88`
    : `0 0 0 0 ${props.theme.base}8`};
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
    background-color: ${props => props.theme.base};
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
    ? props => props.blue
      ? `0 0 0 0.4em ${props.theme.blue}88 inset`
      : `0 0 0 0.4em ${props.theme.red}88 inset`
    : `0 0 0 0 ${props.theme.base}8 inset`};
    transition: box-shadow .3s ease;
  }
`;

const StyledGridSpot = styled.div`
  width: 15vmin;
  height: 15vmin;
  max-width: 3em;
  max-height: 3em;
  flex-shrink: 0;
  grid-area: ${props => props.col} / ${props => props.row} / span 1 / span 1;
  transition: opacity .3s ease;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    background-color: ${props => props.theme.lightShadow};
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

const Grid = styled.div`
  display: grid;
  place-items: center;
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);
  grid-gap: 1em;
  pointer-events: ${props => props.currentState === props.wantedState ? 'auto' : ''};
  opacity: ${props => props.currentState === props.wantedState ? '1' : '0.5'};
  transition: opacity .3s ease;
  & > ${StyledBlock} {
    opacity: ${props => props.hideBlocksEnd ? 0.2 : ''};
  }
`;

const Block = props =>
  <StyledBlock {...props}
    onClick={e => {
      if (!props.setPickedBlock) return;
      props.setPickedBlock({
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
  transition: opacity .3s ease;
  opacity: ${props => props.hidden ? 0 : 1};
  pointer-events: ${props => props.hidden ? 'none' : 'auto'};
`;

//

const BottomCard = styled.section`
  background: ${props => props.theme.input};
  width: 100%;
  max-width: 20em;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 3em 0;
  border-radius: 2em 2em 0 0;
  box-shadow: 0 0 2em #0000002e;
  transition: opacity .3s ease;
  opacity: ${props => props.hidden ? 0 : 1};
  pointer-events: ${props => props.hidden ? 'none' : 'auto'};

  & ${StyledBlock}::after {
    background-color: ${props => props.theme.input};
  }

  & ${StyledBlock} {
    cursor: pointer;
  }
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
    background-color: ${props => props.theme.hardShadow};
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity .3s ease;
  }
`;

const WinningModal = styled.section`
  display: flex;
  max-width: 20em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.base};
  margin: 1em;
  padding: 2em 1em;
  border-radius: 2em;
  position: absolute;
  left: calc(50% - 1em);
  width: calc(100% - 2em);
  right: 0;
  bottom: 0;
  transition:
    opacity .3s ease,
    transform .3s ease;
  opacity: ${props => props.active ? '1' : '0'};
  transform: ${props => props.active
    ? 'translate3d(-50%,0,0)'
    : 'translate3d(-50%,calc(100% + 1em),0)'};
`;

const EndGameModal = styled.section`
  display: flex;
  max-width: 20em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.input};
  margin: 1em;
  padding: 2em 1em;
  text-align: center;
  border-radius: 2em;
  position: fixed;
  left: calc(50% - 1em);
  bottom: 0;
  width: calc(100% - 2em);
  transition:
    opacity .3s ease,
    transform .3s ease;
  opacity: ${props => props.active ? '1' : '0'};
  box-shadow: 0 1em 2em #00000026;
  transform: ${props => props.active
    ? 'translate(-50%, 0) scale(1)'
    : 'translate(-50%, calc(100% + 1em)) scale(0.8)'};
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
    background-color: ${props => props.theme.lightShadow};
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
    fill: ${props => props.theme.icon};
    > path:nth-child(2) {
      fill: ${props => props.type === 'color' ? props.theme.icon2 : ''};
    }
  }
  width: 20%;
  max-height: 100px;
  cursor: pointer;
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
      pickedBlock: null,
      pickedPos: null,
      winning: false,
      end: 0,
      pickedType: null,
      placed: [],
      textNo: 0,
      rematch: 0,
      blocks: [
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'ssrf'} small square red flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bsrh'} big square red hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bcrh'} big circle red hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'scrf'} small circle red flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'ssrh'} small square red hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bsrf'} big square red flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bcrf'} big circle red flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'scrh'} small circle red hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'ssbh'} small square blue hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bsbf'} big square blue flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bcbf'} big circle blue flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'scbh'} small circle blue hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'ssbf'} small square blue flat />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bsbh'} big square blue hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'bcbh'} big circle blue hole />,
        <Block setPickedBlock={v => this.setPickedBlock(v)} key={'scbf'} small circle blue flat />
      ]
    };
    this.initialState = { ...this.state };
    socket.receive('GAME_PLACE', e => {
      this.setState({ state: 'PLACE', textNo: 1 });
      if (!this.hasPlaced) this.hasPlaced = true;
    });
    socket.receive('GAME_PICK', e => {
      this.setState({ state: 'PICK', textNo: 2 });
      if (this.hasPlaced) this.BottomCard.scrollIntoView({ behavior: 'smooth' });
    });
    socket.receive('GAME_WAIT', e => this.setState({ state: 'WAIT', textNo: 3 }));

    socket.receive('GAME_PLACED', ({ pos, block }) => {
      this.setState({ pickedBlock: null });
      if (this.state.textNo === 3) this.setState({ textNo: 0 });
      const placed = [...this.state.placed];
      placed[placed.length - 1] =
        (
          <Block
            style={{
              gridArea: `${Math.floor(pos / 4 + 1)} / ${pos % 4 + 1} / span 1 / span 1`
            }}
            key={pos}
            pos={pos}
            big={block.size === 'big'}
            small={block.size === 'small'}
            circle={block.shape === 'circle'}
            square={block.shape === 'square'}
            hole={block.hole === 'hole'}
            flat={block.hole === 'flat'}
            red={block.color === 'red'}
            blue={block.color === 'blue'} />
        );
      this.setState({ placed });

      const newBlocks = [...this.state.blocks];
      const i = newBlocks.findIndex(block => {
        if (block.props.current !== true) return false;
        return true;
      });
      if (i === -1) return;

      newBlocks[i] = React.cloneElement(newBlocks[i], { ...newBlocks[i].props, current: undefined });
      this.setState({ blocks: newBlocks });
    });

    socket.receive('GAME_PICKED', data => {
      this.setState({
        pickedBlock: data.block,
        pickedPos: null,
        placed: [...this.state.placed, null]
      });
      const placedBlock = data.block;
      const newBlocks = [...this.state.blocks];
      const i = newBlocks.findIndex(block => {
        if (block.props.disabled) return false;
        if (!(placedBlock.size in block.props)) return false;
        if (!(placedBlock.shape in block.props)) return false;
        if (!(placedBlock.hole in block.props)) return false;
        if (!(placedBlock.color in block.props)) return false;
        return true;
      });
      if (i === -1) return;

      newBlocks[i] = React.cloneElement(newBlocks[i], { ...newBlocks[i].props, disabled: true, current: true });
      this.setState({ blocks: newBlocks });
    });

    socket.receive('GAME_END_WIN', pos => {
      if (!Array.isArray(pos)) return;

      let placed;
      if (pos.length === 4) {
        placed = this.state.placed.map(block => {
          if (pos.indexOf(block.props.pos) !== -1) return React.cloneElement(block, { ...block.props, winning: true });
          else return block;
        });
      } else placed = this.state.placed;
      this.Section.scrollIntoView();
      this.setState({ end: 2, state: 'PLACE', winning: false, placed });
    });
    socket.receive('GAME_END_LOSE', pos => {
      if (!Array.isArray(pos)) return;

      let placed;
      if (pos.length === 4) {
        placed = this.state.placed.map(block => {
          if (pos.indexOf(block.props.pos) !== -1) return React.cloneElement(block, { ...block.props, winning: true });
          else return block;
        });
      } else placed = this.state.placed;
      this.Section.scrollIntoView();
      this.setState({ end: 1, state: 'PLACE', winning: false, placed });
    });
    socket.receive('GAME_END_DRAW', data => {
      this.Section.scrollIntoView();
      this.setState({ end: 3, winning: false });
    });
    socket.receive('GAME_DRAW_WAIT', e => {
      this.setState({ state: 'PLACE', textNo: 4 });
      if (!this.hasPlaced) this.hasPlaced = true;
    });
    socket.receive('GAME_REMATCH', e => {
      this.setState(this.initialState);
    });
    socket.receive('GAME_REMATCH_CANCEL', e => {
      this.setState({ rematch: -1 });
    });
  }
  render () {
    return (
      <Section ref={ref => (this.Section = ref)}>
        <BlankFixedSection />
        <FixedSection>
          <Grid
            hideBlocksEnd={this.state.end !== 0}
            currentState={this.state.state}
            wantedState='PLACE' >
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
          <StyledSpan hidden={this.state.end !== 0}>
            {['the opponent is choosing a block for you', 'place your block', 'pick the block for your opponent', 'the opponent is placing his block', 'find the winning combination!'][this.state.textNo]}
          </StyledSpan>
          <Space size={1} />
          <Button
            hidden={this.state.state === 'WAIT' || this.state.end !== 0}
            primary
            onClick={e => this.endRound()}>ok</Button>
          <Button
            hidden={(this.state.state === 'WAIT' && this.state.textNo !== 4) || this.state.end !== 0}
            onClick={e => this.openWinning()}>I won</Button>
        </FixedSection>
        <BottomCard
          hidden={this.state.end !== 0}
          ref={ref => (this.BottomCard = ref)}>
          <Grid
            currentState={this.state.state}
            wantedState='PICK'>
            {this.state.blocks}
          </Grid>
        </BottomCard>
        <ModalContainer active={this.state.winning}>
          <WinningModal active={this.state.winning}>
            <StyledSpan>pick the type of winning blocks</StyledSpan>
            <Space size={1} />
            <IconButtonContainer>
              <IconButton
                onClick={e => this.setState({ pickedType: 'color' })}
                type='color'
                stateType={this.state.pickedType}>
                <svg viewBox='0 0 880 800'>
                  <path d='M160,800A160,160,0,0,1,0,640V160A160,160,0,0,1,160,0H400V800H160Z' />
                  <path d='M879,142.119V657.881A160.015,160.015,0,0,1,720,800H480V0H720A160.016,160.016,0,0,1,879,142.119Z' />
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
        <EndGameModal active={this.state.end}>
          <h2>{['', 'You lost! :(', 'You won! :D', 'You tied!'][this.state.end]}</h2>
          <span>{['', 'Too bad! Better luck next time!', 'Great job! You did awesome!', 'Great minds think alike!'][this.state.end]}</span>
          <Space size={1} />
          <Button
            primary
            disabled={this.state.rematch === 1}
            hidden={this.state.rematch === -1}
            onClick={e => this.rematch()}>rematch</Button>
          <Button onClick={e => socket.comm('USER_LEAVE_ROOM')}>leave</Button>
        </EndGameModal>
      </Section>
    );
  }
  rematch () {
    if (this.state.rematch !== 0) return;
    this.setState({ rematch: 1 });
    socket.comm('REMATCH');
  }
  endRound () {
    if (this.state.end !== 0) return;
    if (this.state.winning) return;

    if (this.state.state === 'PICK' && this.state.pickedBlock != null) {
      socket.comm('GAME_PICKED', this.state.pickedBlock);
    } else if (this.state.state === 'PLACE' && this.state.pickedPos != null && this.state.textNo !== 4) {
      socket.comm('GAME_PLACED', this.state.pickedPos);
    }
  }
  setPickedBlock (data) {
    if (this.state.end !== 0) return;
    if (this.state.state !== 'PICK') return;
    if (this.state.winning !== false) return;
    this.setState({ pickedBlock: data });

    const placedBlock = data;
    const newBlocks = [...this.state.blocks];
    const current = newBlocks.findIndex(block => {
      if (block.props.current) return true;
      return false;
    });

    const i = newBlocks.findIndex(block => {
      if (block.props.disabled) return false;
      if (!(placedBlock.size in block.props)) return false;
      if (!(placedBlock.shape in block.props)) return false;
      if (!(placedBlock.hole in block.props)) return false;
      if (!(placedBlock.color in block.props)) return false;
      return true;
    });
    if (i === -1) return;

    if (current !== -1) newBlocks[current] = React.cloneElement(newBlocks[current], { ...newBlocks[current].props, disabled: false, current: false });
    newBlocks[i] = React.cloneElement(newBlocks[i], { ...newBlocks[i].props, disabled: true, current: true });
    this.setState({ blocks: newBlocks });
  }

  setPickedPos (pos) {
    if (this.state.end !== 0) return;
    if (this.state.state !== 'PLACE') return;
    if (this.state.winning !== false) return;
    this.setState({ pickedPos: pos });

    const block = this.state.pickedBlock;
    const placed = [...this.state.placed];
    placed[placed.length - 1] =
      (
        <Block
          style={{
            gridArea: `${Math.floor(pos / 4 + 1)} / ${pos % 4 + 1} / span 1 / span 1`
          }}
          key={pos}
          big={block.size === 'big'}
          small={block.size === 'small'}
          circle={block.shape === 'circle'}
          square={block.shape === 'square'}
          hole={block.hole === 'hole'}
          flat={block.hole === 'flat'}
          red={block.color === 'red'}
          blue={block.color === 'blue'} />
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
        block: this.state.pickedBlock,
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
