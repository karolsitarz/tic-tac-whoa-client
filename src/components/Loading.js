import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export default styled.div`
  width: 3em;
  height: 3em;
  border-radius: 20%;
  background: #ddd;
  animation: ${spin} 1.5s linear infinite;
  &::before {
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
`;
