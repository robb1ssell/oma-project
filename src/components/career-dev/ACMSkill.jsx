import React, {useState} from 'react';
import ReactHtmlParser from 'react-html-parser'

const ACMSkill = props => {
  const [display, setDisplay] = useState(false);

  return (
    <div className="col-12 col-lg-6">
      <section className={`acmSkill em-c-section em-c-section--expandable ${display ? '':'em-is-closed'}`}>
        <header className="em-c-section__header" onClick={() => setDisplay(!display)}>
          <svg className="em-c-icon em-c-icon--medium em-c-section__icon">
            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={/* Removed due to contract */}></use>
          </svg>
          <h2 className="em-c-section__title ">{props.el.Title}</h2>
        </header>
        <div className="em-c-section__body em-js-section-target">
          {ReactHtmlParser(props.el.Desc)}
          <div className='d-flex justify-content-center pt-3 em-c-text-passage'>
            <a href={/* Removed due to contract */}
              target='_blank'
              rel='noopener noreferrer'
            >
              {/* Removed due to contract */}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ACMSkill;