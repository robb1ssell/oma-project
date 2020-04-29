import React, { Component } from 'react';
import './sass/App.scss';
import Footer from './components/Footer';
import Main from './components/Main';
import ReactNavbar from './components/ReactNavbar';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { initializeFileTypeIcons } from '@uifabric/file-type-icons';
import { initializeIcons } from '@uifabric/icons';

library.add(fab, fas, far);
initializeFileTypeIcons(/* optional base url */);
initializeIcons(/* optional base url */);

class App extends Component {
  render() {
    return (
      <div id='App'>
        <ReactNavbar userInfo={this.props.userInfo}/>
        <Main userInfo={this.props.userInfo}/>
        <Footer/>
      </div>
    );
  }
}

export default App;
