import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class ArchDirBlock extends Component {
  render() {
    return (
      <Link to="/community/architects" 
        className="em-c-picture-card em-c-picture-card--tinted" 
        style={{"backgroundImage": "url({/* Removed due to contract */})"}}
      >
        <div className="em-c-picture-card__header">
          <img 
            src={/* Removed due to contract */}
            alt="Arch Directory Thumbnail"
            className="em-c-picture-card__img" />
        </div>
        <div className="em-c-picture-card__body">
          <h2 className="em-c-picture-card__title">
            Architect Directory
            {/* Removed due to contract */}
          </h2>
          <p className="em-c-picture-card__desc">
            {/* Removed due to contract */}
          </p>
        </div>
      </Link>
    );
  }
}

export default ArchDirBlock;