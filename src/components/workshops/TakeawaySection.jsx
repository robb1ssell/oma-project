import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const TakeawaySection = props => {
  return (
    <div className="row pageSection">
      <div className="col-12 workshopSectionHeader">
        <div className='d-flex justify-content-center mb-5'>
          <h2>Takeaways</h2>
        </div>
      </div>
      <div className="col-12 col-lg-6 d-flex align-items-center pad-lr-30 em-c-text-passage">
        {ReactHtmlParser(props.data.Takeaways)}
      </div>
      <div className="col-12 col-lg-6 d-flex justify-content-center">
        <img 
          src={/* Removed due to contract */}
          alt="mountain-icon"
        />
      </div>
    </div>
  );
};

export default TakeawaySection;