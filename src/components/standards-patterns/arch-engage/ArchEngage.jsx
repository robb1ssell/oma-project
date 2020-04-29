import React, {useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'; //needed for bootbox
import * as bootbox from 'bootbox';

const showLeadArch = () => {
  bootbox.alert({
    message: {/* Removed due to contract */},
    centerVertical: true,
  })
}

const ArchEngage = () => {
  useEffect(() => {
    document.title = 'OMA | ArchEngage'
  }, [])
  return (
    <div id="standards" className='container subPage'>
      <div className="em-c-page-header">
        <h1 className="em-c-page-header__title">
          Architecture Engagement and Assessment Process
        </h1>
      </div>

      {/* EXECUTION SECTION */}
      <div className="row pageSection">
        <div className="col-12 em-c-text-passage">
          <h2 className='mt-0'>Execution</h2>
          <p>
            {/* Removed due to contract */}
          </p>
        </div>
        <div className="col-12 col-lg-4 engageCard">
          <div className="d-flex header header-dark-blue align-items-center">
            <FontAwesomeIcon icon={['fas', 'user-cog']} size='2x' color='#ffffff'/>
            <h2>enable</h2>
          </div>
          <div className="body em-c-text-passage">
            <h4>Early/Scaled Engagement</h4>
            <p>
              {/* Removed due to contract */}
            </p>
            <p>
              {/* Removed due to contract */}
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-4 engageCard">
          <div className="d-flex header header-dark-blue align-items-center">
            <FontAwesomeIcon icon={['fas', 'users']} size='2x' color='#ffffff'/>
            <h2>engage</h2>
          </div>
          <div className="body em-c-text-passage">
            <h4>Design and Build</h4>
            <p>
              {/* Removed due to contract */}
            </p>
            <ul>
              <li>
                <a
                  href={/* Removed due to contract */}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Architecture Engagement Process
                </a>
              </li>
              <li>
                <a
                  href='http://goto/architects'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Lead Architect Focus Areas
                </a>
              </li>
              <li>
                <a
                  href='http://goto/tlaa'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Think Like an Architect
                </a>
              </li>
            </ul>
            <h6>Architecture Assessment Framework</h6>
            <p>
              {/* Removed due to contract */}
            </p>
            <ul>
              <li><a href={/* Removed due to contract */}>{/* Removed due to contract */}</a> - PPT</li>
              <ul>
                <li>
                  {/* Removed due to contract */}
                </li>
              </ul>
            </ul>
            <ul>
              <li><a href={/* Removed due to contract */}></a> - XLS</li>
              <ul>
                <li>
                  {/* Removed due to contract */}
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <div className="col-12 col-lg-4 engageCard">
          <div className="d-flex header header-dark-blue align-items-center">
            <FontAwesomeIcon icon={['fas', 'user-check']} size='2x' color='#ffffff'/>
            <h2>endorse</h2>
          </div>
          <div className="body em-c-text-passage">
            <h4>Collaboration and Guidance</h4>
            <p>
              {/* Removed due to contract */} 
            </p>
            <ul>
              <li>
                {/* Removed due to contract */}
              </li>
            </ul>
            <p>
              {/* Removed due to contract */}
            </p>
            <p>
              {/* Removed due to contract */}
            </p>
            <ul>
              <li>
                {/* Removed due to contract */}
              </li>
            </ul>
            <p>
              {/* Removed due to contract */}
            </p>
            <p>
              {/* Removed due to contract */}
            </p>
          </div>
        </div>
      </div>

      {/* SCALED PROJECT SECTION */}
      <div className="row pageSection">
        <div className="col-12">
          <h2>Scaled Project Engagements</h2>
          <p>
            {/* Removed due to contract */}
          </p>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <img src={/* Removed due to contract */} alt=""/>
        </div>

        <div className="col-12 col-lg-3 engageCard">
          <div className="header header-lightest-blue d-flex align-items-center justify-content-center">
            <h3>Limited "Watch"</h3>
          </div>
          <div className="body em-c-text-passage">
            <h6>Time Commitment</h6>
            <p>{`< 3 WFD, Billed to A&T Base`}</p>
            <h6>Goal</h6>
            <p>
              {/* Removed due to contract */}
            </p>
            <h6>Anticipated A&T Engagement Activities</h6>
            <ul>
              <li>{/* Removed due to contract */}</li>
              <li>{/* Removed due to contract */}</li>
            </ul>
            <h6>Anticipated A&T Deliverables</h6>
            <ul>
              <li>{/* Removed due to contract */}</li>
              <li>{/* Removed due to contract */}</li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-lg-3 engageCard">
          <div className="header header-light-blue d-flex align-items-center justify-content-center">
            <h3>Low "Influence"</h3>
          </div>
          <div className="body em-c-text-passage">
            {/* Removed due to contract */}
          </div>
        </div>
        <div className="col-12 col-lg-3 engageCard">
          <div className="header header-dark-blue d-flex align-items-center justify-content-center">
            <h3>Moderate "Guide"</h3>
          </div>
          <div className="body em-c-text-passage">
            {/* Removed due to contract */}
          </div>
        </div>
        <div className="col-12 col-lg-3 engageCard">
          <div className="header header-darkest-blue d-flex align-items-center justify-content-center">
            <h3>High "Partner"</h3>
          </div>
          <div className="body em-c-text-passage">
            {/* Removed due to contract */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchEngage;