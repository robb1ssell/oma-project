import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const SetupSection = props => {
  return (
    <div className="row pageSection">
      {
        props.data.Show_Prework ? 
        <div className='col-12'>
          <div className=" mb-4 workshopSectionHeader">
            <div className='d-flex justify-content-center'>
              <h2>Setup</h2>
            </div>
          </div>
          <div className="col-12 d-flex flex-column flex-lg-row justify-content-center">
            <div className="d-flex flex-column justify-content-center">
              <h3 className='mb-3 centerText'>Pre-Work</h3>
              <div className="workshopIconContainer">
                <img 
                  src={/* Removed due to contract */}
                  alt="prework-icon"
                />
              </div>
            </div>
            <div className="d-flex align-items-center complexSection pl-lg-5 mt-4 mt-lg-0 em-l-linelength-container">
              {ReactHtmlParser(props.data.Pre_Work)}
            </div> 
          </div>
        </div>
        :
        ''
      }
    </div>
  );
};

export default SetupSection;