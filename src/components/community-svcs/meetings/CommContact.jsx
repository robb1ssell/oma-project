import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CommContact extends Component {
  render() {
    return (
      <div className='comm-contact'>
        <div className="flex">
          <a href={this.props.profileLink} className="verticalAlign" target='_blank' rel='noreferrer noopener'>
            <div className="commContactBody">
              <img 
                src={this.props.profilePicture}
                ref={img => this.img = img}
                alt=''
                className='mySitePic'
                onError={() => this.img.src = this.props.noPic}>
              </img>
              <div className='commContactName verticalAlign'>
                {this.props.contactName}
              </div>
            </div>
          </a>
          <div className="ml-auto flex flex-col centerText commContactIcons">
            <a href={`mailto:${this.props.email}`} className="">
              <i className="far fa-envelope fa-2x"></i>
            </a>
            <a href={this.props.sip} className="">
              <FontAwesomeIcon icon={['fab', 'skype']} size='2x'/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default CommContact;