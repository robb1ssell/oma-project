import 'react-app-polyfill/ie11';
import 'core-js';
import "@pnp/polyfill-ie11";
import smoothscroll from 'smoothscroll-polyfill';
// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './sass/index.scss';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AzureAD, MsalAuthProviderFactory, LoginType } from 'react-aad-msal';
// eslint-disable-next-line no-unused-vars
import { msalConfig, authParams } from './msalConfig';
//import MSALWrapper from './msal/index';
// eslint-disable-next-line no-unused-vars
import Loadable from 'react-loadable';
import ScrollToTop from './ScrollToTop';
import { Provider } from 'react-redux'
import configureStore from './redux/store';

const store = configureStore();

// kick off the polyfill!
smoothscroll.polyfill();
//require('es6-promise').polyfill(); //package from npm es6-promise; Needed to fix IE. Only works for IE 11+
//require('es6-object-assign').polyfill();

const LoadableApp = Loadable({
  loader: () => import('./App'), 
  loading: () => null,
});
  
  class Index extends Component {
    state = {
      userInfo: null,
    }
    
    userJustLoggedIn = (accInfo) => {
      this.setState({
        userInfo: accInfo
      })
    }
  
    render() {
      return(
        <AzureAD
          provider={
            new MsalAuthProviderFactory(msalConfig, authParams, LoginType.Redirect)
          }
          forceLogin={true}
          accountInfoCallback={this.userJustLoggedIn}
        >
          <HashRouter>
            <ScrollToTop>
              <Provider store={store}>
                <LoadableApp userInfo={this.state.userInfo}/>
              </Provider>
            </ScrollToTop>
          </HashRouter>
        </AzureAD>
      );
    }
  }

  ReactDOM.render(
    <Index/>
    , document.getElementById('root')
  );
   
  
  // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
