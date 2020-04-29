import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BottomNavButtons = props => {
  return (
    <div className="row pageSection">
      <div className="col-12 col-lg-6 d-flex justify-content-center">
        {
          !props.data.Workshop ? '' :
            props.pageID > 1 ?
              <button 
                onClick={props.prevHandler}
                className='em-c-btn em-c-btn--primary mb-3'
              >
                <div className="em-c-btn__inner">
                  <FontAwesomeIcon icon={['fas', 'arrow-left']} color='#FFFFFF'/>
                  <span className="em-c-btn__text ml-2">{`Previous: ${props.currentSet[props.pageID-2].Title}`}</span>
                </div>
              </button>
            :
            ''
        }
      </div>
      <div className="col-12 col-lg-6 d-flex justify-content-center">
        { !props.data.Workshop ? '' : //check data.workshop; if exists, check url id vs current set length
            props.pageID < props.currentSet.length ?
              <button 
                onClick={props.nextHandler}
                className='em-c-btn em-c-btn--primary mb-3'
              >
                <div className="em-c-btn__inner">
                  <span className="em-c-btn__text mr-2">{`Next: ${props.currentSet[props.pageID].Title}`}</span>
                  <FontAwesomeIcon icon={['fas', 'arrow-right']} color='#FFFFFF'/>
                </div>
              </button>
            :
            props.pageID === props.currentSet.length && props.currentChecklist ?
              <button 
                onClick={props.nextHandler}
                className='em-c-btn em-c-btn--primary mb-3'
              >
                <div className="em-c-btn__inner">
                  <span className="em-c-btn__text mr-2">{`Next: ${props.params.phase} Checklist`}</span>
                  <FontAwesomeIcon icon={['fas', 'arrow-right']} color='#FFFFFF'/>
                </div>
              </button>
            :
            props.lastPhase ?
            ''
            :
              <button 
                onClick={props.nextPhaseHandler}
                className='em-c-btn em-c-btn--primary mb-3'
              >
                <div className="em-c-btn__inner">
                  <span className="em-c-btn__text mr-2">{`Next: ${props.phaseList[props.currentPhaseOrderID].Title} Phase`}</span>
                  <FontAwesomeIcon icon={['fas', 'arrow-right']} color='#FFFFFF'/>
                </div>
              </button>
        }
      </div>
    </div>
  );
};

export default BottomNavButtons;