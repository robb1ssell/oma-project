import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TopNavCondensed = props => {
  return (
    <div id="wkshop-nav-wrapper" className='pt-4'>
      {
        props.showCondensedNav ?
          <div id="condensed-nav">
            <div className="row">
              <div className="col-12 col-lg-8 ">
                <div className='d-flex flex-column flex-lg-row align-items-center mt-1 pb-2 pb-lg-0'>
                  <Link to={`/workshops/${props.params.name}/${props.params.phase}`}>
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
                            className=''
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
                  <div className="phase-navigation__condensed pl-xl-5 ml-xl-5">
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
              </div>
              <div className="col-12 col-lg-4">
                <div className="set-navigation">
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
                        </li>
                      :
                      ''
                    }
                  </ol>
                </div>
              </div>
            </div>
          </div>
        :
        ''
      }
      <div className="navHider col-12 justify-content-center">
        {
          props.showCondensedNav ? 
            <div 
              onClick={() => props.navDisplayHandler(props.showCondensedNav, props.setShowCondensedNav)}
              className='pointer pb-2'
            >
              <span className='pr-2'>Hide Navigation</span>
              <FontAwesomeIcon icon={['fas', 'angle-double-up']} color='#002F6C'/>
            </div>
          :
            <div 
              onClick={() => props.navDisplayHandler(props.showCondensedNav, props.setShowCondensedNav)}
              className='pointer pb-2'
            >
              <span className='pr-2'>Show Navigation</span>
              <FontAwesomeIcon icon={['fas', 'angle-double-down']} color='#002F6C'/>
            </div>

        }
      </div>
    </div>
  );
};

export default TopNavCondensed;