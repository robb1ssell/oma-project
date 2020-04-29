import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Issues = props => {
  return (
    <div id='issues-list' className="mt-3">
      {
        props.issues.map(issue => (
          <div className="d-flex mt-2" key={issue.issueNumber}>
            <div className=''>
              <a href={issue.url}
                target='_blank'
                rel='noreferrer noopener'
              >
                <h6 className='mb-2'>{`#${issue.issueNumber} - ${issue.title}`}</h6>
              </a>
              <div className='d-flex flex-row align-items-center'>
                <FontAwesomeIcon icon={['far', 'comments']}/>
                <span className='pl-2'>{issue.commentCount}</span>
              </div>
              <p className='mb-0'>{`Created: ${issue.created}`}</p>
              <p className='mb-0'>{`Last Update: ${issue.lastUpdate}`}</p>
            </div>
            <div className="d-flex flex-column justify-content-around align-items-center ml-auto">
              <div className='d-flex flex-row align-items-center'>
                <FontAwesomeIcon icon={['far', 'thumbs-up']} color='#0c69b0'/>
                <span className='pl-2'>{issue.upvotes}</span>
              </div>
              <div className='d-flex flex-row align-items-center'>
                <FontAwesomeIcon icon={['far', 'thumbs-down']} color='#ad1723'/>
                <span className='pl-2'>{issue.downvotes}</span>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default Issues;