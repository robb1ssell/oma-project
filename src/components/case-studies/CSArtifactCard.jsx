import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const CSArtifactCard = props => {
  return (
    <div className="em-c-media-block blockWithShadow caseStudyArtifact">
      <div className="em-c-media-block__media">
        <img src={props.thumbnail} alt="Artifact Thumbnail" className="em-c-media-block__img" />
      </div>
      <div className="em-c-media-block__body justify-content-start">
        <div className="em-c-status ">
          <h4 className='mb-0 mt-1'>{props.layer}</h4>
        </div>
        <h2 className="em-c-media-block__headline mt-2">{props.name}</h2>
        <p className="em-c-media-block__desc">{props.outcome}</p>
        {ReactHtmlParser(props.links)}
      </div>
    </div>
  );
};

export default CSArtifactCard;