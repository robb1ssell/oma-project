import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ArchAnglePreviewItem extends Component {
  render() {
    return (
      <li className="em-c-picture-card-list__item em-l-grid__item aaPreviewItem">
        <Link 
          to={`/community/AAArchive/display/${this.props.id}`}
          className="em-c-picture-card em-c-picture-card--background" 
          style={{"backgroundImage": `url(${this.props.img})`}}
        >
          <div className="em-c-picture-card__body">
            <p className="em-c-picture-card__kicker">{this.props.itemType !== 'None' ? this.props.itemType : ''}</p>
            <h2 className="em-c-picture-card__title">{this.props.title}</h2>
          </div>
        </Link>
      </li>
    );
  }
}

export default ArchAnglePreviewItem;