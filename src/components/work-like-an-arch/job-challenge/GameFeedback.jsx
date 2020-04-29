import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactHtmlParser from 'react-html-parser'

const GameFeedback = props => {
  return (
    <div className="col-12">
      <div className="row">
        <div className="col-12 centerText pb-5">
          <h2>Score: <span className={props.score > 0 ? 'greenText' : 'redText'}>{props.score}</span> / {props.maxScore}</h2>
        </div>
        <div className="col-12 col-lg-6 mt-5">
          <div className="d-flex flex-wrap scoreLegend justify-content-between mb-3">
            <div>
              <FontAwesomeIcon icon={['fas', 'check-circle']} className='noClick' color='#127208'/>
              <span className='pl-2'>Correct (+1)</span>
            </div>
            <div>
              <FontAwesomeIcon icon={['fas', 'times-circle']} className='noClick' color='#AC120C'/>
              <span className='pl-2'>Wrong (-1)</span>
            </div>
            <div>
              <FontAwesomeIcon icon={['fas', 'minus-circle']} className='noClick' color='#5E5959'/>
              <span className='pl-2'>Missed (-0.5)</span>
            </div>
          </div>
          <div className="taskBoard contentInner prettifyScrollBar">
            { 
              props.feedback.map(el => {
                let resultIcon = {};
                switch (el.result) {
                  case 'correct':
                    resultIcon.icon = 'check-circle'
                    resultIcon.color = '#127208'
                    break;
                  case 'wrong':
                    resultIcon.icon = 'times-circle'
                    resultIcon.color = '#AC120C'
                    break;
                  case 'missed':
                    resultIcon.icon = 'minus-circle'
                    resultIcon.color = '#5E5959'
                    break;
                  default:
                    break;
                }

                return (
                  <div key={`${el.id}-${el.result}`}
                    className='d-flex flex-row justify-content-between align-items-center archTask blockWithShadow'
                  >
                    <FontAwesomeIcon icon={['fas', resultIcon.icon]} className='noClick' color={resultIcon.color} size='2x'/>
                    <p taskid={el.id} className='noClick mb-0 pr-2 pl-2'>{el.task}</p>
                    <div
                      onClick={() => {props.setDesc(el.desc)}}
                      className='pointer taskInfoBtn'
                    >
                      <FontAwesomeIcon icon={['fas', 'info-circle']} className='noClick' color='#021075' size='2x'/>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div id='task-desc' className="col-12 col-lg-6 d-flex align-items-center mt-5">
            {
              props.desc !== '' ?
                <div className="contentInner em-c-text-passage taskDescContainer">
                  <h4 className='mt-0 mb-5 pb-2'>Task Description</h4>
                  <div className="em-l-linelength-container">
                    {ReactHtmlParser(props.desc)}
                  </div>
                </div>
              :
                  <h5 className='centerText mt-0'>
                    Click the info button to learn more about a task
                  </h5>
            }
        </div>
      </div>
    </div>
  );
};

export default GameFeedback;