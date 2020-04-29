import React from 'react';
import { HashLink as Link } from 'react-router-hash-link'

const ACMIntroSection = () => {
  return (
    <div id='acm-intro' className='row'>
      <div className="col-12 col-lg-4">
        <div className="boxBody">
          <Link
            to='/dev/career-new#acm-designation-section'
            scroll={el => {
              const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
              const yOffset = -70;

              window.scrollTo({
                  top: yCoordinate + yOffset,
                  behavior: 'smooth'
              });
            }}
          >
            <div className="imgWrapper">
              <img src={/* Removed due to contract */}
                  alt="acm-designations"/>
            </div>
          </Link>
          <div className="boxText">
            {/* Removed due to contract */}
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-4">
        <div className="boxBody">
          <Link
            to='/dev/career-new#acm-certifications'
            scroll={el => {
              const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
              const yOffset = -70;

              window.scrollTo({
                  top: yCoordinate + yOffset,
                  behavior: 'smooth'
              });
            }}
          >
            <div className="imgWrapper">
              <img src={/* Removed due to contract */}
                  alt="acm-skills"/>
            </div>
          </Link>
          <div className="boxText">
            <p>
              {/* Removed due to contract */}
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-4">
        <div className="boxBody">
          <Link
            to='/dev/career-new#acm-process'
            scroll={el => {
              const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
              const yOffset = -70;

              window.scrollTo({
                  top: yCoordinate + yOffset,
                  behavior: 'smooth'
              });
            }}
          >
            <div className="imgWrapper">
              <img src={/* Removed due to contract */}
                  alt="acm-council"/>
            </div>
          </Link>
          <div className="boxText">
            <p>
              {/* Removed due to contract */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACMIntroSection;