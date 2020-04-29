import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'

const CourseCard = props => {
  let icon;
  switch (props.type) {
    case "Instructor-Led":
      icon = 'chalkboard-teacher';
      break;
    case "Online":
      icon = 'laptop-code';
      break;
    case "Self-Study":
      icon = 'book-reader';
      break;
    default:
      break;
  }

  return (
    <li className="courseCard em-c-solid-card-list__item em-l-grid__item">
        <div className="em-c-solid-card ">
          <div className="em-c-solid-card__body pb-1">
            <FontAwesomeIcon
              icon={['fas', icon]}
              color='#000000'
              size='2x'
              className='mb-3'
            />
            <h4 className="em-c-solid-card__kicker">{props.kicker ? props.kicker : ''}</h4>
            <h3 className="em-c-solid-card__title">{props.title ? props.title : ''}</h3>
            <p>{props.desc ? props.desc : ''}</p>
          </div>
          <Link to={`/training/course/${props.title}`}>
            <div class="em-c-solid-card__footer">
              <h6 className='mb-0'>Details & Scheduled Trainings</h6>
            </div>
          </Link>
        </div>
    </li>
  );
};

export default CourseCard;