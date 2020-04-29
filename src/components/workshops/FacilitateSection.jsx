import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const FacilitateSection = props => {
  return (
    <div className="templateSection">
      <div className="row pageSection">
        <div className="col-12 mb-4 workshopSectionHeader">
          <div className='d-flex justify-content-center'>
            <h2>Facilitate</h2>
          </div>
        </div>
        <div className="col-12 col-lg-8 pr-lg-5 pl-lg-5 pt-4 pb-4 em-c-text-passage nestedLists">
          {ReactHtmlParser(props.data.Facilitate)}
        </div>
        <div className="col-12 col-lg-4 pl-lg-5 pr-lg-5 pt-4 pt-lg-0 pb-4 noteBorder">
          <h4 className='centerText'>Facilitator Notes</h4>
          {ReactHtmlParser(props.data.Facilitator_Notes)}
        </div>
      </div>
      {
        props.data.Show_Tips ? 
          <div className="row mt-5 mb-5">
            <div className="col-12 col-lg-2"></div>
            <div className="col-12 col-lg-3">
              <div className="whyBox">
                <div className="workshopIconContainer">
                  <img 
                    src={/* Removed due to contract */}
                    alt="tips-icon"
                  />
                </div>
                <h6>ExxonMobil Tips & Best Practices</h6>
              </div>
            </div>
            <div className="col-12 col-lg-5 pad-lr-30">
              {ReactHtmlParser(props.data.Tips_Practices)}
            </div>
            <div className="col-12 col-lg-2"></div>
          </div>
        :
        ''
      }
    </div>
  );
};

export default FacilitateSection;