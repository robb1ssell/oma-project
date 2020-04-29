import React from 'react';
import { Link } from 'react-router-dom'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CaseStudyCard = (props) => {
  return (
    <li className="em-c-picture-card-list__item em-l-grid__item">
      <Link to={props.pathToDetail} 
        className="em-c-picture-card em-c-picture-card--background"
        style={{backgroundImage: `url(${props.image.Url})`}}
      >
        <div className="em-c-picture-card__body">
          <p className="em-c-picture-card__kicker">{props.date}</p>
          <h2 className="em-c-picture-card__title">
            {props.title}
            <svg className="em-c-icon em-c-icon--small em-c-picture-card__icon">
              <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={/* Removed due to contract */}></use>
            </svg>
          </h2>
          <p className="em-c-picture-card__desc">{props.summary}</p>
        </div>
      </Link>
    </li>
  );
};

export default CaseStudyCard;