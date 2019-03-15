import React, { Component, createContext } from 'react';

// Provider and Consumer are connected through their "parent" context
const { Provider, Consumer } = createContext();

export class ProviderSetup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      section: 'Login',
      socket: this.props.socket || null
    };
  }
  render () {
    return (
      <Provider value={{
        state: this.state,
        changeSection: section => {
          if (typeof section !== 'string') return false;
          this.setState({ section });
        }
      }}>
        {this.props.children}
      </Provider>
    );
  }
}

export default Consumer;
