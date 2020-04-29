import React, { Component } from 'react';
import Offerings from './Offerings';
import MoreButton from './MoreButton';

class Home extends Component {
  componentDidMount = () => {
    document.title = 'Office of Modern Architecture'
  }

  render() {
    return (
      <div id='home'>
        <div className="fullViewHeight"></div>
        <div className="em-l-container homeTitle">
          <h1 className="em-c-page-header__title">oma</h1>
          <h2>Office of Modern Architecture</h2>
        </div>
        <div id="why-ent-arch" className="pageSection">
          <div className="container">
            <div className="row">
              <div id='yt-container' className="col-12 embed-responsive embed-responsive-16by9">
                <iframe title='why-ent-arch-video' id='why-ent-arch-video' width="560" height="315" 
                  src="https://www.youtube-nocookie.com/embed/qDI2oF1bASk" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>
        </div>
        <div id='what-we-do' className="pb-5 mb-5">
          <div className="container">
            <h2 className='sectionHeader'>What we do</h2>
            <div className="row">
              <div className="col-lg-6">
                <Offerings/>
              </div>
              <div className="col-lg-6">
                <img id='restaurant' src={/* Removed due to contract */} alt="OMA Operating Concept"/>
              </div>
            </div>
          </div>
        </div>

        <div className="pageSpacer">
          <hr/>
        </div>

        <div id="arch-supp" className="pageSection noGutter">
          <div className="container-fluid noGutter">
            <div className="row">
              <div className="col-lg-6 noGutter">
                <div className="contentInner">
                  <div className='em-l-linelength-container em-c-text-passage alignAllCenter'>
                    <h2 className='sectionHeader'>Architecture Support</h2>
                    <img className='' src={/* Removed due to contract */} alt="Arch Svcs Logo"/>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                  </div>
                  <MoreButton page={'/archsupport'} disabled={false} className={'em-c-btn em-c-btn--primary'}/>
                </div>
              </div>
              <div className="col-lg-6 noGutter archImgSection"></div>
            </div>
          </div>
        </div>

        <div className="pageSpacer">
          <hr/>
        </div>

        <div id="standards-patterns" className="pageSection">
          <div className="container-fluid noGutter">
            <div className="row">
              <div className="col-lg-6 noGutter patternImgSection"></div>
              <div className="col-lg-6 noGutter">
                <div className="contentInner">
                  <div className='em-l-linelength-container em-c-text-passage alignAllCenter'>
                    <h2 className='sectionHeader'>Standards & Patterns</h2>
                    <img className='' src={/* Removed due to contract */} alt="Standards Patterns Logo"/>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                  </div>
                  <MoreButton page={'/standards'} disabled={false} className={'em-c-btn em-c-btn--primary'}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pageSpacer">
          <hr/>
        </div>

        <div id="bottom-content-grid" className="pageSection">
          <div className="container-fluid noGutter">
            <div className="row">
              <div className="col-lg-4 noGutter">
                <div className="contentInner">
                  <div className='em-l-linelength-container em-c-text-passage alignAllCenter'>
                    <h2 className='sectionHeader'>Career Development</h2>
                    <img className='' src={/* Removed due to contract */} alt="Career Services Logo"/>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                  </div>
                  <MoreButton page={'/career'} disabled={false} className={'em-c-btn em-c-btn--primary'}/>
                </div>
              </div>
              <div className="col-lg-4 noGutter">
                <div className="contentInner">
                  <div className='em-l-linelength-container em-c-text-passage alignAllCenter'>
                    <h2 className='sectionHeader'>Training Services</h2>
                    <img className='' src={/* Removed due to contract */} alt="Training Logo"/>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                  </div>
                  <MoreButton page={'/training'} disabled={false} className={'em-c-btn em-c-btn--primary'}/>
                </div>
              </div>
              <div className="col-lg-4 noGutter">
                <div className="contentInner">
                  <div className='em-l-linelength-container em-c-text-passage alignAllCenter'>
                    <h2 className='sectionHeader'>Community Services</h2>
                    <img className='' src={/* Removed due to contract */} alt="Community Services Logo"/>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                  </div>
                  <MoreButton page={'/community/home'} disabled={false} className={'em-c-btn em-c-btn--primary'}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;