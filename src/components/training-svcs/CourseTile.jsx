import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CourseTile extends Component {
  render() {
    return (
      <Link to={`/training/course/${this.props.title}`} className="em-c-tile courseTile" key={this.props.title}>
        <FontAwesomeIcon icon={["fas", "graduation-cap"]} size='2x'/>
        <h3 className="em-c-tile__desc mb-0 ml-4">{this.props.title}</h3>
      </Link>
    );
  }
}

export default CourseTile;