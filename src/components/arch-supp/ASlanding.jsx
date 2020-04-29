import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios';
//import PictureTileListItem from '../PictureTileListItem';

class ASlanding extends Component {
  componentDidMount = () => {
    document.title = 'OMA | Architecture Support'
  }

  render() {
    return (
      <div id="standards">
        <div className='container subPage'>
          <div className="subPageHeading em-c-page-header">
            <h1 className="em-c-page-header__title">Architecture Support</h1>
            <p className='em-c-page-header__desc'>
              {/* Removed due to contract */}
            </p>
          </div>
          <div className='row pageSection'>
            <div className='col-12 col-md-4 iconbox pb-5'>
                <div className='iconbox-img'>
                  <img 
                    src={/* Removed due to contract */}
                    alt="Tool Visual"
                  />
                </div>
                <div className="boxBody centerText">
                  <h6>Architecture Framework</h6>
                  <p>
                    {/* Removed due to contract */}
                  </p>
                </div>
            </div>
            <div className='col-12 col-md-4 iconbox pb-5'>
              <Link to='/wlaa/challenge'>
                <div className='iconbox-img'>
                  <img 
                    src={/* Removed due to contract */}
                    alt="Tool Visual"
                    />
                </div>
                <div className="boxBody centerText">
                  <h6>Know Your Role Challenge</h6>
                  <p>
                    {/* Removed due to contract */}
                  </p>
                </div>
              </Link>
            </div>
            <div className='col-12 col-md-4 iconbox pb-5'>
              <Link to='/archsupport/templates'>
                <div className='iconbox-img'>
                  <img 
                    src={/* Removed due to contract */}
                    alt="Tool Visual"
                    />
                </div>
                <div className="boxBody centerText">
                  <h6>Templates</h6>
                  <p>
                    {/* Removed due to contract */}
                  </p>
                </div>
              </Link>
            </div>
            <div className='col-12 col-md-4 iconbox pb-5'>
              <Link to='/archsupport/archshowcase'>
                <div className='iconbox-img'>
                  <img 
                    src={/* Removed due to contract */}
                    alt="Tool Visual"
                    />
                </div>
                <div className="boxBody centerText">
                  <h6>Architecture Showcase</h6>
                  <p>
                    {/* Removed due to contract */}
                  </p>
                </div>
              </Link>
            </div>
            <div className='col-12 col-md-4 iconbox pb-5'>
              <Link to='/workshops'>
                <div className='iconbox-img'>
                  <img 
                    src={/* Removed due to contract */}
                    alt="Tool Visual"
                    />
                </div>
                <div className="boxBody centerText">
                  <h6>Architecture Playbooks</h6>
                  <p>
                    {/* Removed due to contract */}
                  </p>
                </div>
              </Link>
            </div>
            <div className='col-12 col-md-4 iconbox pb-5'>
              <a href={/* Removed due to contract */}>
                <div className='iconbox-img'>
                  <img 
                    src={/* Removed due to contract */}
                    alt="Tool Visual"
                    />
                </div>
                <div className="boxBody centerText">
                  <h6>Technology Management Process</h6>
                  <p>
                    {/* Removed due to contract */}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ASlanding;