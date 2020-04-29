import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const Checklist = props => {
  return (
    <div>
    {
      props.data ?
        <div>
          <div className="row pageSection">
            <div className="em-c-page-header col-12 centerText">
              <h1 className="em-c-page-header__title blueText">{props.data.Title}</h1>
              <p className="em-c-page-header__desc mr-auto ml-auto">{props.data.Wrap_Up}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className='d-flex justify-content-center workshopSectionHeader pb-3'>
                <h2>Takeaways</h2>
              </div>
              {ReactHtmlParser(props.data.Key_Takeaways)}
            </div>
            <div className="col-12 col-lg-6 checklistItems">
              <div className="d-flex align-items-center mb-5">
                <img src={/* Removed due to contract */} alt="stop sign"/>
                <h4>
                  {`Ensure Completion of Checklist for ${props.data.Parent_Phase ? props.data.Parent_Phase.Title : ''} Phase`}
                </h4>
              </div>
              <div className="pl-5">
                {ReactHtmlParser(props.data.Checklist_Items)}
              </div>
            </div>
          </div>
        </div>
        :
        ''
      }
    </div>
  );
};

export default Checklist;