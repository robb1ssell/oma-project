import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GeneralPersona extends Component {
  render() {
    /** Make up of each individual card. Data passed from GeneralPersonaPage component.
     *  Structure is specific to be returned to list item for Unity card list.
     */
    return (
      <div className="em-c-card personaCard">
        <div className="em-c-card__body">
          <div className="em-c-media-block em-c-media-block--small">
            <div className="em-c-media-block__media">
              <img src={this.props.imageUrl} alt="Persona Avatar" className="em-c-media-block__img" />
            </div>
            <div className="em-c-media-block__body leftPad">
              <Link to={this.props.linkToDetail}>
              <h2 className="em-c-media-block__headline roleHeading">{this.props.role}</h2>
              </Link>
              <p className="em-c-media-block__desc topMargin">{this.props.description}</p>
            </div>
          </div>
        </div>
        <div className="em-c-card__footer centerText">
        <Link to={this.props.linkToDetail}>
          <button
            className='em-c-btn viewDetailsBtn'
          >
            <div className="em-c-btn__inner">
              {/* Removed due to contract */}
              <span className="em-c-btn__text">View Details</span>
            </div>
          </button>
        </Link>
        </div>
      </div>
    );
  }
}

export default GeneralPersona;