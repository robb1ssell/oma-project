import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ContactIcons extends Component {
  render() {
    return (
      <div className="contactIcons mt-auto">
        <a href={`mailto:${this.props.email}`} className="">
          <FontAwesomeIcon icon={["far", "envelope"]} size='2x'/>
        </a>
        <a href={`sip:${this.props.email}`} className="">
          <FontAwesomeIcon icon={["fab", "skype"]} size='2x'/>
        </a>
        {
          this.props.ccp ?
            <a href={this.props.ccp}
              className=""
              target='_blank'
              rel='noopener noreferrer'
            >
              <FontAwesomeIcon icon={["fas", "user"]} size='2x'/>
            </a>
            :
            ''
        }
      </div>
    );
  }
}

export default ContactIcons;