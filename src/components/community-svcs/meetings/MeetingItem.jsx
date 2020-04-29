import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class MeetingItem extends Component {
  render() {
    return (
      <li className="em-c-tile-list__item em-l-grid__item">
        <Link to={this.props.pathToPage} className="em-c-tile meetingTile">
          <span className="em-c-tile__headline">{this.props.meetingTitle}</span>
          <span className="em-c-tile__desc">{moment(this.props.meetingDate).format('MM-DD-YYYY')}</span>
        </Link>
      </li>
    );
  }
}

export default MeetingItem;