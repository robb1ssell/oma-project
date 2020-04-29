import React, { Component } from 'react';
import ContactIcons from '../ContactIcons';

class TeamMember extends Component {
  render() {
    return (
      <div className="em-c-media-block col-lg-6 mb-4 pb-4 pr-5 pl-5" key={this.props.ID}>
        <div className="em-c-media-block__media align-items-center">
          <img src={/* Removed due to contract */}
            alt="Alt Text" 
            className="em-c-media-block__img aboutUsPic"
            ref={img => this.img = img}
            onError={() => this.img.src = '{/* Removed due to contract */}'}
          />
        </div>
        <div className="em-c-media-block__body em-c-text-passage aboutUsBody">
          <h2 className="em-c-media-block__headline mb-0 mt-0">
            {this.props.fname} {this.props.lname} {(this.props.contractorTag !== '') ? this.props.contractorTag : ''}
          </h2>
          <h4 className="em-c-status__label mb-0 mt-0">{this.props.role}</h4>
          <p className="em-c-media-block__desc mb-2">
            {this.props.blurb}
          </p>
          <ContactIcons
            email={this.props.email}
            domain={this.props.domain}
            username={this.props.username}
            ccp={this.props.ccp}
          />
        </div>
      </div>
    );
  }
}

export default TeamMember;