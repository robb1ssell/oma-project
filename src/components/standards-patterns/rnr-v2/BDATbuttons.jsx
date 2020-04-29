import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BDATbuttons extends Component {
  render() {
    return (
      <div id="bdat-links" className={this.props.visible ? 'displayed' : 'hidden'}>
        <div id="overview-btn-container" className={this.props.overviewVisible ? 'displayed' : 'hidden'}>
          <Link to={this.props.overviewPath}>
            <button
              id='overview-btn'
              className='em-c-btn overviewBtn'
            >
              <div className="em-c-btn__inner">
                {/* Removed due to contract */}
                <span className="em-c-btn__text">Commonalities</span>
              </div>
            </button>
          </Link>
        </div>
        <ul className="em-c-tile-list em-l-grid em-l-grid--1-2-4up em-l-grid--break-slow">
          <li className="em-c-tile-list__item em-l-grid__item">
            <Link to={this.props.businessPath}>
              <button
                id='business-btn' 
                disabled={this.props.buttonDisabledList[0]}
                className={this.props.buttonDisabledList[0] ? 'em-c-btn em-c-btn--disabled': 'em-c-btn'}
              >
                <div className="em-c-btn__inner">
                  {/* Removed due to contract */}
                  <span className="em-c-btn__text">Business</span>
                </div>
              </button>
            </Link>
          </li>
          <li className="em-c-tile-list__item em-l-grid__item">
            <Link to={this.props.dataPath}>
              <button 
                id='data-btn'
                disabled={this.props.buttonDisabledList[1]}
                className={this.props.buttonDisabledList[1] ? 'em-c-btn em-c-btn--disabled': 'em-c-btn'}
              >
                <div className="em-c-btn__inner">
                  {/* Removed due to contract */}
                  <span className="em-c-btn__text">Data</span>
                </div>
              </button>
            </Link>
          </li>
          <li className="em-c-tile-list__item em-l-grid__item">
            <Link to={this.props.appsPath}>
              <button 
              id='application-btn'
                disabled={this.props.buttonDisabledList[2]}
                className={this.props.buttonDisabledList[2] ? 'em-c-btn em-c-btn--disabled': 'em-c-btn'}
              >
                <div className="em-c-btn__inner">
                  {/* Removed due to contract */}
                  <span className="em-c-btn__text">Application</span>
                </div>
              </button>
            </Link>
          </li>
          <li className="em-c-tile-list__item em-l-grid__item">
            <Link to={this.props.techPath}>
              <button 
                id='technology-btn'
                disabled={this.props.buttonDisabledList[3]}
                className={this.props.buttonDisabledList[3] ? 'em-c-btn em-c-btn--disabled': 'em-c-btn'}
              >
                <div className="em-c-btn__inner">
                  {/* Removed due to contract */}
                  <span className="em-c-btn__text">Technology</span>
                </div>
              </button>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default BDATbuttons;