import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const bgspin = keyframes`
  to {
    transform: translate(-50%,-50%) rotate(-360deg);
  }
`;

export default styled.div`
  width: 3em;
  height: 3em;
  border-radius: 20%;
  background: #ddd;
  animation: ${spin} 1.5s linear infinite;
  overflow: hidden;
  &::after {
    content: "";
    height: 50%;
    width: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    border-radius: 50%;
  }
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 145%;
    height: 145%;
    transform: translate(-50%,-50%);
    background-image: linear-gradient(to right, #fc8ca1, #dc64b9, #8c5dc7, #5b80cc);
    animation: ${bgspin} 1s linear infinite;
  }
`;
