import React from 'react';
import { simpleAction } from './redux/actions/firstAction'
import { connect } from 'react-redux';

/* 
 * mapDispatchToProps
*/
const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
})

/* 
 * mapStateToProps
*/
const mapStateToProps = state => ({
  ...state
})

const reduxtext = props => {
  const simpleAction = (event) => {
    props.simpleAction();
  }

  return (
    <div className="test">
      <header className="test-header">
        <h1 className="test-title">Welcome to React</h1>
      </header>
      <pre>
        {
          JSON.stringify(props)
        }
      </pre>
      <button onClick={simpleAction}>Test redux action</button>
      <p className="test-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxtext);