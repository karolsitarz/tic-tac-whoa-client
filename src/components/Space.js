import styled from 'styled-components';

export default styled.div`
  align-self: stretch;
  height: ${props => !props.horizontal && props.size}em;
  width: ${props => props.horizontal && props.size}em;
`;
