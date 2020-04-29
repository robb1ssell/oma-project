import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

class ScheduledTile extends Component {
  render() {
    return (
      <a 
        href={this.props.eventXLink} 
        className="em-c-tile d-flex justify-se mt-2 mb-2"
        target='_blank'
        rel='noopener noreferrer'
      >
        <FontAwesomeIcon icon={["fas", "university"]} size='2x'/>
        <span className="em-c-tile__desc mb-0 ml-4">{this.props.title}</span>
        <span className="em-c-tile__desc mb-0 ml-4">{this.props.location}</span>
        <span className="em-c-tile__desc mb-0 ml-4">
          {moment(this.props.startDate).format('MM/DD')} - {moment(this.props.endDate).format('MM/DD')}
        </span>
      </a>
    );
  }
}

export default ScheduledTile;