import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const TemplateBlock = (props) => {
  return (
    <div className="row pageSection">
      <div className='col-lg-12 templateBlock'>
        <div className="templateContent">
          <div className="row templateHeader pb-3 d-flex">
            <div className="col-12 col-md-6">
              <h2>{props.title}</h2>
              <div className="blockTags d-flex pt-3 flex-wrap">
                {props.tags}
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-md-end justify-content-center layerIcons pb-3 pt-2">
              {props.layerIcon}{props.domainIcon}
            </div>
          </div>
          <div className="row templateBody showListBullets">
            <div className="templateIcons col-12 col-md-3 pb-3 centerText">
              {props.icon}
            </div>
            <div className='col-12 col-md-9 blockData'>
              <div className="row">
                <div className="col-12 col-md-3"><h5>Description</h5></div>
                <div className="col-12 col-md-9">{ReactHtmlParser(props.desc)}</div>
              </div>
              <div className="row">
                <div className="col-12 col-md-3"><h5>Purpose</h5></div>
                <div className="col-12 col-md-9">{props.purpose}</div>
              </div>
              { props.concerns ?
                <div className="row">
                  <div className="col-12 col-md-3"><h5>Concerns Addressed</h5></div>
                  <div className="col-12 col-md-9">{ReactHtmlParser(props.concerns)}</div>
                </div>
                :
                null
              }
              { props.stakeholders ?
                <div className="row">
                  <div className="col-12 col-md-3"><h5>Stakeholders</h5></div>
                  <div className="col-12 col-md-9">{props.stakeholders}</div>
                </div>
                :
                null
              }
              { props.templates.length > 0 ?
                <div className="row">
                  <div className="col-12 col-md-3"><h5>Templates</h5></div>
                  <div className="col-12 col-md-9">{props.templates}</div>
                </div>
                :
                null
              }
              { props.variant ?
                <div className="row">
                  <div className="col-12 col-md-3"><h5>Variant Of</h5></div>
                  <div className="col-12 col-md-9">{props.variant}</div>
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

export default TemplateBlock;