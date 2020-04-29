import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Footer extends Component {
  render() {
    return (
      <footer className="em-c-footer sticky-bottom" role="contentinfo">
        <div className="container-fluid">
          <div className="row pr-3 pl-3">
            <div className="col-12 col-sm-6 col-xl-3 mb-4 justify-content-center">
              <div className="em-c-text-passage">
                <h4 className="whiteText mt-0">Site Links</h4>
              </div>
              <ul className="em-c-multicolumn-nav footerNavLinks pl-2" role="navigation">
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/archsupport" className="em-c-multicolumn-nav__link">Architecture Support</Link>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/standards" className="em-c-multicolumn-nav__link">Standards & Patterns</Link>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/career" className="em-c-multicolumn-nav__link">Career Development</Link>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/training" className="em-c-multicolumn-nav__link">Training Services</Link>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/community/home" className="em-c-multicolumn-nav__link">Community Services</Link>
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-xl-3 mb-4">
              <div className="em-c-text-passage">
                <h4 className="whiteText mt-0">Relevant Links</h4>
              </div>
              <ul className="em-c-multicolumn-nav footerNavLinks pl-2" role="navigation">
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/links" className="em-c-multicolumn-nav__link">Link Directory</Link>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <a href="http://goto/at" className="em-c-multicolumn-nav__link">Architecture & Technology (A&T)</a>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <a href="http://goto/focusteams" className="em-c-multicolumn-nav__link">A&T Focus Teams</a>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <a href={/* Removed due to contract */} className="em-c-multicolumn-nav__link">MPI & Other Information</a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-xl-3 mb-4">
              <div className="em-c-text-passage">
                <h4 className="whiteText mt-0">Connect With OMA</h4>
              </div>
              <ul className="footerNavLinks pl-2" role="navigation">
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <Link to="/about"
                    className='em-c-multicolumn-nav__link'
                  >
                    <div className="flex">
                      <FontAwesomeIcon icon={['fas', 'users']} color='white' fixedWidth />
                      <span className='flex align-items-center pl-4 whiteText'>About Us</span>
                    </div>
                  </Link>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <a href={/* Removed due to contract */}
                    className='em-c-multicolumn-nav__link'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <div className="flex">
                      <FontAwesomeIcon icon={['fab', 'yammer']} color='white' fixedWidth />
                      <span className='flex align-items-center pl-4 whiteText'>Join Our Yammer Group</span>
                    </div>
                  </a>
                </li>
                <li className="em-c-multicolumn-nav__item footerNavItem">
                  <a href={/* Removed due to contract */}
                    className='em-c-multicolumn-nav__link'
                  >
                    <div className="flex">
                      <FontAwesomeIcon icon={['far', 'paper-plane']} color='white' fixedWidth />
                      <span className='flex align-items-center pl-4 whiteText'>Send Us Feedback</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-xl-3 mb-4">
              <div id="footer-logos" className='d-flex align-items-center justify-content-around'>
                {/* Removed due to contract */}
                <img className="itLogo" src={/* Removed due to contract */} alt="EMIT Logo"/>
              </div>
              <div className='whiteText centerText'>
                {/* Removed due to contract */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;