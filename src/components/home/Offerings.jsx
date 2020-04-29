import React, { Component } from 'react';

class Offerings extends Component {
  render() {
    return (
      <div id='offerings-container'>
        <div className="offeringCard">
          <div className="offeringInner">
            <img className='offeringLogo' src={/* Removed due to contract */} alt="Arch Svcs Logo"/>
            <p className="offeringHeader">Architecture Support</p>
          </div>
        </div>
        <div className="offeringCard">
          <div className="offeringInner">
            <img className='offeringLogo' src={/* Removed due to contract */} alt="Standards Logo"/>
            <p className="offeringHeader">Standards & Patterns</p>
          </div>
        </div>
        <div className="offeringCard">
          <div className="offeringInner">
            <img className='offeringLogo' src={/* Removed due to contract */} alt="Career Services Logo"/>
            <p className="offeringHeader">Career Development</p>
          </div>
        </div>
        <div className="offeringCard">
          <div className="offeringInner">
            <img className='offeringLogo' src={/* Removed due to contract */} alt="Training Logo"/>
            <p className="offeringHeader">Training Services</p>
          </div>
        </div>
        <div className="offeringCard">
          <div className="offeringInner">
            <img className='offeringLogo' src={/* Removed due to contract */} alt="Community Services Logo"/>
            <p className="offeringHeader">Community Services</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Offerings;