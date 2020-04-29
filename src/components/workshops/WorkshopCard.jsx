import React from 'react';
import { Link } from 'react-router-dom'

const WorkshopCard = props => {
  return (
    <li className="em-c-picture-card-list__item em-l-grid__item">
      {
        props.external ? 
        <a href={props.link}
          className="em-c-picture-card em-c-picture-card--background"
          style={{'backgroundImage': `url(${props.image})`}}
        >
          <div className="em-c-picture-card__body">
            <p className="em-c-picture-card__kicker">{props.kicker}</p>
            <h2 className="em-c-picture-card__title">{props.title}</h2>
            <p className="em-c-picture-card__desc">{props.desc}</p>
          </div>
        </a>
        :
        <Link to={props.link}
          className="em-c-picture-card em-c-picture-card--background"
          style={{'backgroundImage': `url(${props.image})`}}
        >
          <div className="em-c-picture-card__body">
            <p className="em-c-picture-card__kicker">{props.kicker}</p>
            <h2 className="em-c-picture-card__title">{props.title}</h2>
            <p className="em-c-picture-card__desc">{props.desc}</p>
          </div>
        </Link>
      }
    </li>
  );
};

export default WorkshopCard;