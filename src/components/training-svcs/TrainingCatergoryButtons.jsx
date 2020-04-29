import React, { Component } from 'react';

class TrainingCatergoryButtons extends Component {
  render() {
    return (
      <div className="em-c-btn-bar pb-4 pt-2 d-flex justify-se">
        <ul className="em-c-btn-bar__list">
          <li className="em-c-btn-bar__item ">
            <button 
              className="em-c-btn em-c-btn--small em-c-btn--bare" 
              onClick={(e) => {this.props.showCourses(e)}}
              style={this.props.activeSection === 'For IT Architects' ? {borderBottom: 'solid'} : {}}
            >
              <span className="em-c-btn__text">For IT Architects</span>
            </button>
          </li>
          <li className="em-c-btn-bar__item em-c-btn-bar__item--separator"></li>
          <li className="em-c-btn-bar__item">
            <button 
              className="em-c-btn em-c-btn--small em-c-btn--bare" 
              onClick={(e) => {this.props.showCourses(e)}}
              style={this.props.activeSection === 'For Business Leaders' ? {borderBottom: 'solid'} : {}}
            >
              <span className="em-c-btn__text">For Business Leaders</span>
            </button>
          </li>
          <li className="em-c-btn-bar__item em-c-btn-bar__item--separator"></li>
          <li className="em-c-btn-bar__item ">
            <button 
              className="em-c-btn em-c-btn--small em-c-btn--bare" 
              onClick={(e) => {this.props.showCourses(e)}}
              style={this.props.activeSection === 'For Management / Supporting Roles' ? {borderBottom: 'solid'} : {}}
            >
              <span className="em-c-btn__text">For Management / Supporting Roles</span>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default TrainingCatergoryButtons;