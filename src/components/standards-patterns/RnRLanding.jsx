import React, { Component } from 'react';
import PersonaList from './rnr-v2/PersonaList';
import ImageGallery from 'react-image-gallery';
import '../../../node_modules/react-image-gallery/styles/scss/image-gallery.scss';
//import GeneralPersonaPage from './GeneralPersonaPage';

const images = [
  {
    original: 'https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/RnR_Area_of_Focus.png',
  },
  {
    original: 'https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/Span_of_Control.png',
  },
];

class RnRLanding extends Component {
  render() {
    return (
      <div id="rnr-landing">
        <div className='container-fluid noGutter'>
          <div id='rnr-landing-img' className="contentWrapper">
            <div className="row">
              <div className="col-sm-12">
                <h1 className="em-c-page-header pageHeaderFix whiteText">Enterprise Architecture Roles and Responsibilities</h1>
                <div className="sectionIntro whiteText">
                  <h2 className="sectionHeader whiteText">Roles</h2>
                  <p>
                    A detailed look into the different roles within EA.
                  </p>
                </div>
              </div>
            </div>
            <PersonaList/>
          </div>
          <div className="row">
            <div className="col-sm-12 pageSection">
              <ImageGallery
                items={images}
                infinite={true}
                showThumbnails={false}
                showPlayButton={false}
                showFullscreenButton={false}
              />
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default RnRLanding;