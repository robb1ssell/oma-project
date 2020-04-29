import React, { Component } from 'react';

class UnityIconButton extends Component {
  render() {
    if (this.props.iconRight === true) {
      return (
        <button 
          className={`em-c-btn ${this.props.classes}`}
          onClick={this.props.onClick}
        >
          <div className="em-c-btn__inner">
            <span className="em-c-btn__text">{this.props.text}</span>
            {/* Removed due to contract */}
          </div>
        </button>
      );
    }
    else {
      return (
        <button 
          className={`em-c-btn ${this.props.classes}`}
          onClick={this.props.onClick}
        >
          <div className="em-c-btn__inner">
            {/* Removed due to contract */}
            <span className="em-c-btn__text">{this.props.text}</span>
          </div>
        </button>
      );
    }
  }
}

export default UnityIconButton;