import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const ComplexitySection = props => {
  return (
    <div className='row'>
      {
        props.data.Show_Complexity ? 
          <div className="col-md-6">
            <h3 className='mb-5 centerText'>Complexity Guidance</h3>
            <div className="complexSection d-flex flex-column">
              <div className="workshopIconContainer mb-3">
                <img 
                  src={/* Removed due to contract */}
                  alt="clock-icon"
                />
              </div>
              <div className='d-flex justify-content-center align-items-center mt-4 mt-lg-0'>
                <div className='pl-3'>
                  <h4 className='complexHeader complexHeader-green'>Low</h4>
                  <p className='mb-3'>{props.data.Complexity_Low}</p>
                  <h4 className='complexHeader complexHeader-yellow'>Medium</h4>
                  <p className='mb-3'>{props.data.Complexity_Medium}</p>
                  <h4 className='complexHeader complexHeader-red'>High</h4>
                  <p className='mb-0'>{props.data.Complexity_High}</p>
                </div>
              </div>
            </div>
          </div>
        :
        props.data.Show_Recommended_Time ?
          <div className="col-md-6">
            <h3 className='mb-5 centerText'>Recommended Time / Format</h3>
            <div className='complexSection d-flex flex-column justify-content-center align-items-center'>
              <div className="workshopIconContainer">
                <img 
                  src={/* Removed due to contract */}
                  alt="clock-icon"
                />
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4">
                <h5 className="mb-0 mt-0">{props.data.Recommended_Time}</h5>
              </div>
            </div>
          </div>
        :
        ''
      }
      {
        props.data.Show_Associated_Assets ?
          <div className="col-md-6">
            <h3 className='mb-5 mt-5 mt-md-0 centerText'>Associated Assets</h3>
            <div className='complexSection d-flex flex-column align-items-center'>
              <div className="workshopIconContainer mb-3">
                <img 
                  src={/* Removed due to contract */}
                  alt="artifacts-icon"
                />
              </div>
              <div className="em-c-text-passage mt-4 mt-lg-0">
                {ReactHtmlParser(props.data.Associated_Assets)}
              </div>
            </div>
          </div>
        :
        ''
      }
    </div>
  );
};

export default ComplexitySection;