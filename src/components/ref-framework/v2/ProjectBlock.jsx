import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProjectBlock = props => {
  return (
    <div className="fileBlock d-flex row blockWithShadow">
      <div className="fileBlock__body col-12 col-lg-7 d-flex flex-column  ">
        <h5>{`${props.type} ${props.category ? `| ${props.category}` : ''}`}</h5>
        <Link to={`/emaf/reference-framework/display/${props.id}`}>
          <h3>{props.name}</h3>
        </Link>
        <p>{props.desc}</p>
        { props.tags ?
          <ul className="em-c-tags mt-auto">
            {
              props.tags.map(el => (
                <li key={el} className="em-c-tags__item em-js-tags-item">
                  <span className="em-c-tags__link">{el}</span>
                </li>
              ))
            }
          </ul>
          :
          ''
        }
      </div>
      <div className="col-12 col-lg-5 d-flex flex-column">
        <div className="d-flex justify-content-end">
          {
            props.starred ?
              <button
                className="em-c-btn starBtn"
                onClick={() => props.removeStar(props.id, props.setUserStars, props.setProjectData, props.setArchTypeOptions, props.setCategoryOptions, props.setAvailableTags, props.gitlabUserInfo)}
              >
                <div className="em-c-btn__inner">
                  <FontAwesomeIcon icon={['fas', 'star']} className='em-c-icon em-c-icon--small em-c-btn__icon'/>
                  <span className="em-c-btn__text">Unstar</span>
                </div>
              </button>
            :
              <button
                className="em-c-btn starBtn"
                onClick={() => props.addStar(props.id, props.setUserStars, props.setProjectData, props.setArchTypeOptions, props.setCategoryOptions, props.setAvailableTags, props.gitlabUserInfo)}
              >
                <div className="em-c-btn__inner">
                  <FontAwesomeIcon icon={['far', 'star']} className='em-c-icon em-c-icon--small em-c-btn__icon'/>
                  <span className="em-c-btn__text">Star</span>
                </div>
              </button>
          }
        </div>
        <div className="fileBlock__stats d-flex flex-column justify-content-end mt-auto">
          <div className=" d-flex flex-row justify-content-end">
            <div className="fileStatBox fileStatBox__issue d-flex flex-row align-items-center">
              <FontAwesomeIcon icon={['fas', 'exclamation-triangle']}/>
              <span>{props.issueCount}</span>
            </div>
            <div className="fileStatBox d-flex flex-row align-items-center">
              <FontAwesomeIcon icon={['fas', 'code-branch']}/>
              <span>{props.forksCount}</span>
            </div>
            <div className="fileStatBox fileStatBox__star d-flex flex-row align-items-center">
              <FontAwesomeIcon icon={['fas', 'star']}/>
              <span>{props.starCount}</span>
            </div>
          </div>
          <div className="d-flex justify-content-end italic">
            <span>Last Activity: {props.lastActivity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBlock;