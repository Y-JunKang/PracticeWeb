import React, { Component } from 'react';
import './App.css';
import Game from './Game'

class App extends Component {
  render() {
    return (
      <Game condition={5} width={20}/>
    );
  }
}

export default App;
