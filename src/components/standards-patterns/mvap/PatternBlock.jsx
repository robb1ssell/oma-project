import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const PatternBlock = (props) => {
  return (
    <div className="row pageSection">
      <div className='col-lg-12 patternBlock'>
        <div className="templateContent">
          <div className="row templateHeader pb-3 d-flex">
            <div className="col-12 col-lg-6">
              <h2>{props.title}</h2>
              <div className="blockTags d-flex pt-3 flex-wrap">
                {props.tags}
              </div>
            </div>
            <div className="col-12 col-lg-6 d-flex justify-content-lg-end justify-content-center layerIcons pb-3 pt-2">
              {props.layerIcon}{props.domainIcon}
            </div>
          </div>
          <div className="row templateBody showListBullets">
            <div className="templateIcons col-12 col-lg-3 pb-3">
              <picture>
                <source media='(min-width: 992px)' srcSet={props.icon}/>
                <img src={props.landscapeIcon} alt='pattern icon'/>
              </picture>
            </div>
            <div className="col-12 col-lg-9 blockData">
              <div className="row">
                <div className="col-12 col-lg-3"><h5>Description</h5></div>
                <div className="col-12 col-lg-9">{props.desc}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>Purpose</h5></div>
                <div className="col-12 col-lg-9">{props.purpose}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>Why</h5></div>
                <div className="col-12 col-lg-9">{ReactHtmlParser(props.why)}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>What</h5></div>
                <div className="col-12 col-lg-9">{ReactHtmlParser(props.what)}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>How</h5></div>
                <div className="col-12 col-lg-9">{ReactHtmlParser(props.how)}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>With What</h5></div>
                <div className="col-12 col-lg-9">{ReactHtmlParser(props.withWhat)}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>When</h5></div>
                <div className="col-12 col-lg-9">{ReactHtmlParser(props.when)}</div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-3"><h5>Templates</h5></div>
                <div className="col-12 col-lg-9">{props.templates}</div>
              </div>
              { props.variant ?
                <div className="row">
                  <div className="col-12 col-lg-3"><h5>Variant Of</h5></div>
                  <div className="col-12 col-lg-9">{props.variant}</div>
                </div>
                :
                null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternBlock;