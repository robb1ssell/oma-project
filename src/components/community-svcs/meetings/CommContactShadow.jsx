import React, { Component } from 'react';

class CommContactShadow extends Component {
  render() {
    return (
      <div className='comm-contact__shadow'>
        <div className="flex">
          <div className="verticalAlign">
            <a href={this.props.profileLink} className="" target='_blank' rel='noreferrer noopener'>
              <span>{this.props.contactName}</span>
              <img 
                src={this.props.profilePicture}
                ref={img => this.img = img}
                alt=''
                className='mySitePic commContactPic'
                onError={() => this.img.src = this.props.noPic}>
              </img>
            </a>
          </div>
          <div className="flex flex-col centerText pad-left-20">
            <a href={`mailto:${this.props.email}`} className="">
              <i className="far fa-envelope fa-2x"></i>
            </a>
            <a href={this.props.sip} className="">
              <i className="fab fa-skype fa-2x"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default CommContactShadow;