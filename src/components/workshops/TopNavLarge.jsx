import React from 'react';
import { Link } from 'react-router-dom'

const TopNavLarge = props => {
  return (
    <div>
      <div className="d-flex justify-content-center flex-column flex-sm-row">
        <Link to={`/workshops/${props.params.name}/${props.params.phase}`} className='mr-auto ml-auto ml-md-0'>
          <button className="em-c-btn em-c-btn--bare">
            <div className="em-c-btn__inner">
              <span className="em-c-btn__text">Return to {props.params.phase} Summary</span>
            </div>
          </button>
        </Link>
        {
          props.phaseList.map((phase, i) => {
            if (phase.Title === props.params.phase) {
              return (
                <a href={phase.Phase_Guide.Url} key={i}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mr-auto ml-auto ml-md-0'
                >
                  <button className="em-c-btn em-c-btn--bare">
                    <div className="em-c-btn__inner">
                      <span className="em-c-btn__text">
                        {props.params.phase} Workshop Guide
                      </span>
                    </div>
                  </button>
                </a>
              )
            }
            return null;
          })
        }
        <div className="em-c-btn-bar mb-2 d-flex justify-content-center p-2 phase-navigation justify-self-center">
          <ol className="em-c-btn-bar__list flex-row">
            {
              props.phaseList.map(el => (
                <li key={el.Title} className="em-c-btn-bar__item ">
                  <button 
                    className={
                      `em-c-btn em-c-btn--small em-js-btn-selectable ${el.Title === props.params.phase ? 'em-is-active' : ''}`
                    }
                    onClick={e => props.phaseNavHandler(e, props.history)}
                  >
                    <span className="em-c-btn__text">{el.Title}</span>
                  </button>
                </li>
              ))
            }
          </ol>
        </div>
      </div>
      <div className='set-navigation'>
        <ol className="em-c-progress-tracker">
          {
            props.currentSet.map(el => (
              <li
                key={el.Title}
                className={
                  `em-c-progress-tracker__item pointer
                  ${el.OrderID > props.pageID ? 'em-is-disabled' : 
                    el.OrderID < props.pageID ? 'em-is-complete' : 'em-is-current'}`
                }
                onClick={() => {props.setNavHandler(props.history, el.OrderID)}}
              >
                <div className="em-c-progress-tracker__number">
                  {el.OrderID}
                </div>
                <div className="em-c-progress-tracker__label">
                  {el.Title}
                </div>
              </li>
            ))
          }
          {
            props.currentChecklist ?
              <li
                className={
                  `em-c-progress-tracker__item pointer
                  ${props.currentSet.length + 1 > props.pageID ? 'em-is-disabled' : 
                    props.currentSet.length + 1 < props.pageID ? 'em-is-complete' : 'em-is-current'}`
                }
                onClick={() => {props.setNavHandler(props.history, (props.currentSet.length + 1))}}
              >
                <div className="em-c-progress-tracker__number">
                  {props.currentSet.length + 1}
                </div>
                <div className="em-c-progress-tracker__label">
                  {props.currentChecklist.Title}
                </div>
              </li>
            :
            ''
          }
        </ol>
      </div>
    </div>
  );
};

export default TopNavLarge;