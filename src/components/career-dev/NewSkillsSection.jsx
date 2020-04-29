import React from 'react';
import ACMSkill from './ACMSkill';

const NewSkillsSection = props => {
  return (
    <div id='acm-skills-section' className='row'>
      <div className="col-12">
        <div className="em-c-field em-c-field--toggle d-flex justify-content-center flex-column">
          <h2 className="sectionHeader pb-2">Skills</h2>
          <div className="em-c-field__body d-flex justify-content-center">
            <div className="em-c-toggle">
              <input className="em-c-toggle__input em-u-is-vishidden"
                type="radio"
                id="functional-skills"
                name="skillswap"
                defaultChecked
                onClick={() => props.setSkillTypeShown('Functional')}
                />
              <label className="em-c-toggle__label" htmlFor="functional-skills">
                Functional Skills
              </label>
              <input className="em-c-toggle__input em-u-is-vishidden"
                type="radio"
                id="leadership-skills"
                name="skillswap"
                onClick={() => props.setSkillTypeShown('Leadership')}
              />
              <label className="em-c-toggle__label" htmlFor="leadership-skills">
                Leadership Skills
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 centerText mb-5">
            {
              props.skillTypeShown === 'Functional' ?
                <h3>Architect skills complement your current Job Role skills</h3>
                :
                <h3>The key leadership behaviors of Architects:</h3>
            }
          </div>
          {
            props.data.map(el => {
              if (el.Skill_Type === props.skillTypeShown) {
                return <ACMSkill key={el.Title} el={el}/>
              }
              else {
                return null;
              }
            })
          }
        </div>
      </div>
    </div>
  );
};

export default NewSkillsSection;