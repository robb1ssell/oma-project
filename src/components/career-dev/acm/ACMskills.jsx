import React, { Component } from 'react';
import { leadershipSkills } from './leaderSkills';
import { functionalSkills } from './funcSkills';

class ACMskills extends Component {
  constructor() {
    super()

    this.state = {
      displayedSkills: 'functional-skills',
      leaderSkills: [],
      funcSkills: [],
    }
  }

  componentDidMount = () => {
    this.createFuncSkillMarkup();
    this.createLeaderSkillMarkup();
  }

  createFuncSkillMarkup = () => {
    let funcItems = [];
    functionalSkills.forEach(el => {
      funcItems.push(
        <li className='col-12 col-md-6 d-flex flex-wrap' key={el.skill}>
          <h5 className='mt-0 mb-2'>{el.skill}</h5>
          <p>{el.desc}</p>
        </li>
      );
    })
    this.setState({ funcSkills: funcItems })
  }

  createLeaderSkillMarkup = () => {
    let leaderItems = [];
    leadershipSkills.forEach(el => {
      leaderItems.push(
        <li className='col-12 col-md-6 d-flex flex-wrap' key={el.skill}>
          <h5 className='mt-0 mb-2'>{el.skill}</h5>
          <p>{el.desc}</p>
        </li>
      )
    })
    this.setState({ leaderSkills: leaderItems })
  }

  handleSkillSwap = node => {
    if (node.id !== this.state.displayedSkills) {
      this.setState({ displayedSkills: node.id })
    }
  }

  render() {
    return (
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
                ref={node => this.functionalRadio = node}
                onClick={e => this.handleSkillSwap(this.functionalRadio)}
                />
              <label className="em-c-toggle__label" htmlFor="functional-skills">
                Functional Skills
              </label>
              <input className="em-c-toggle__input em-u-is-vishidden"
                type="radio"
                id="leadership-skills"
                name="skillswap"
                ref={node => this.leadershipRadio = node}
                onClick={e => this.handleSkillSwap(this.leadershipRadio)}
              />
              <label className="em-c-toggle__label" htmlFor="leadership-skills">
                Leadership Skills
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ul id="skills-display" className="d-flex flex-wrap">
              { this.state.displayedSkills === 'functional-skills' ?
                  this.state.funcSkills
                  :
                  this.state.leaderSkills
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ACMskills;