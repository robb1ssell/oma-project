import React from 'react';
import ReactHtmlParser from 'react-html-parser'

const MeetCouncilSection = props => {
  return (
    <div id='meet-acm-council' className='row'>
      <div className="col-12">
        <h2 className="sectionHeader mb-5">Meet the panel</h2>
      </div>
      {
        props.data.map(el => (
          <div key={el.name} className="col-12 col-lg-6">
            <section className="em-c-section em-c-section em-c-section--split">
              <header className="em-c-section__header centerText">
                <img src={el.picture} alt="council-member"/>
              </header>
              <div className="em-c-section__body">
                <h2 className="em-c-section__title blueText">{el.name}</h2>
                <div className="em-c-text-passage">
                  {ReactHtmlParser(el.desc)}
                </div>
              </div>
            </section>
          </div>
        ))
      }
    </div>
  );
};

export default MeetCouncilSection;