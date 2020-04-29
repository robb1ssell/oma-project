import React, { useEffect, useState } from 'react';
//import sp from "utils/sharepoint";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GameFeedback from './GameFeedback';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'; //needed for bootbox
import * as bootbox from 'bootbox';
import { Button } from 'reactstrap'
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint'

//helper function for checking if item is a correct answer for current role of challenge
//accepts 2 args, the identifier for the role and the task object
//we only care if it matches our current role, so switch case on the role
//return the id of the task to be stored in the answers array
const checkIfAnswer = (role, task) => {
  switch (role) {
    case 'Chief':
      if (task.MatchesChief) {
        return task.ID
      }
      break;
    case 'Enterprise':
      if (task.MatchesEnterprise) {
        return task.ID
      }
      break;
    case 'Capability':
      if (task.MatchesCapability) {
        return task.ID
      }
      break;
    case 'Domain':
      if (task.MatchesDomain) {
        return task.ID
      }
      break;
    case 'Solution':
      if (task.MatchesSolution) {
        return task.ID
      }
      break;
    case 'System':
      if (task.MatchesSystem) {
        return task.ID
      }
      break;

    default:
      return null;
  }
}

//click handler for adding arch tasks, accepts arguments for the task element
//as well as the state arrays and set methods for each
//uses the custom attribute to add to selections and remove from choices at the same time
const handleSelect = (el, choices, selections, setSelections, setChoices) => {
  let taskid = el.firstElementChild.getAttribute('taskid');
  choices.forEach(item => {
    if (item.id === Number(taskid)) {
      setSelections([...selections, item])
      setChoices(choices.filter(c => c.id !== item.id))
    }
  })
}

//click handler for removing arch tasks, accepts arguments for the task element
//as well as the state arrays and set methods for each
//uses the custom attribute to add to choices and remove from selections at the same time
const handleRemoval = (el, choices, selections, setSelections, setChoices) => {
  let taskid = el.previousSibling.getAttribute('taskid'); //need previous sibling here b/c icon is not in same element
  selections.forEach(item => {
    if (item.id === Number(taskid)) {
      setChoices([...choices, item])
      setSelections(selections.filter(c => c.id !== item.id))
    }
  })
}

//from https://stackoverflow.com/a/46545530/10140836
const shuffleArray = (array) => {
  return array.map((a) => ({sort: Math.random(), value: a}))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value)
}

//gets called when user clicks submit button
//takes args for choices, answer ids, user selections, method for setting score and feedback states
const gradeTest = (choices, answers, selections, setScore, setFeedback) => {
  let netScore = 0;
  let feedback = [];

  if (selections.length < 5) {
    bootbox.alert({
      message: "You must select at least 5 tasks.",
      centerVertical: true,
    });
  }
  else {
    selections.forEach(el => {
      if (answers.indexOf(el.id) !== -1) { //selected and in answers (check)
        el.result = 'correct';
        feedback.push(el)
        answers.splice(answers.indexOf(el.id), 1) //remove from answers
        netScore += 1;
      }
      else if (answers.indexOf(el.id) === -1) { //selected but not in answers (x)
        el.result = 'wrong';
        feedback.push(el)
        netScore -= 1;
      }
    })

    if (answers.length > 0) { //if any answers are still in array, they are correct but weren't selected
      netScore -= (answers.length * 0.5); //subtract .5 for each one
      choices.forEach(el => {
        if (answers.indexOf(el.id) !== -1) {
          el.result = 'missed';
          feedback.push(el);
        }
      })
    }
    
    setScore(netScore);
    setFeedback(feedback);
  }
}

//Called from the start over button; needed because other data pull is in useEffect based on archRole changes
const getFreshData = (archRole, setAnswers, setChoices, setMaxScore) => {
  const getTasks = async () => {
    let choiceObjs = [];
    let answerIDs = [];

    const data = await axios.get(
      spListApiUrl('OMA_WLAA_Arch_Tasks'),
      spConfig
    );

    data.forEach(task => {
      choiceObjs.push(
        {
          id: task.ID,
          task: task.Title,
          desc: task.TaskDesc,
        }
      );

      let answerID = checkIfAnswer(archRole.split(' ')[0], task)
      if (answerID) {
        answerIDs.push(answerID)
      }
    })

    setAnswers(answerIDs)
    setMaxScore(answerIDs.length)
    setChoices(shuffleArray(choiceObjs))
  }
  getTasks();
}

const GameStart = props => {
  const [archRole, setArchRole] = useState('')
  const [choices, setChoices] = useState([]) //choices are the arch tasks
  const [selections, setSelections] = useState([]) //selections are what the user chose
  const [answers, setAnswers] = useState([])
  const [maxScore, setMaxScore] = useState()
  const [score, setScore] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [desc, setDesc] = useState('')

  //updates page tab title on mount
  useEffect(() => {
    document.title = 'OMA | Know Your Role Challenge'
  }, [])

  //userInfo object is passed via render props in Main Switch
  //checks our Architect Directory list for the current user's email address
  //if the user is in the directory, set archRole state to their role
  useEffect(() => {
    const checkIfArch = async user => {
      const list = spListApiUrl('Architect%20Community');
      const listWithOdata = `${list}?$expand=Name&$select=*,Name/EMail&$filter=Name/EMail%20eq'${user}'`;

      const result = await axios.get(
        listWithOdata,
        spConfig
      );
      console.log(result)
      const data = result.data.d.results;
      
      if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
          if (key === 'Architecture_x0020_Role') {
            setArchRole(data[0][key]);
          }
        })
      }
    }
    checkIfArch(props.userInfo.account.userName)
  }, [props.userInfo.account.userName])

  //only execute if we already know the role because we will get tasks and determine correct answers here
  //create state array with info we need to create task UI
  //check if each task is a correct answer, add id of task to answers array if so
  useEffect(() => {
    if (archRole !== '') {
      const getTasks = async () => {
        let choiceObjs = [];
        let answerIDs = [];

        const resp = await axios.get(
          spListApiUrl('OMA_WLAA_Arch_Tasks'),
          spConfig
        );

        resp.data.d.results.forEach(task => {
          choiceObjs.push(
            {
              id: task.ID,
              task: task.Title,
              desc: task.TaskDesc,
            }
          );

          let answerID = checkIfAnswer(archRole.split(' ')[0], task)
          if (answerID) {
            answerIDs.push(answerID)
          }
        })

        setAnswers(answerIDs)
        setMaxScore(answerIDs.length)
        setChoices(shuffleArray(choiceObjs))
      }
      getTasks();
    }
  }, [archRole])

  return (
    <div className='container-fluid'>
      <div className="row pageHeaderBlueBG">
        <div className="em-c-page-header container whiteText">
          <h1 className="em-c-page-header__title">Know Your Role Challenge</h1>
          <p className='em-c-page-header__desc'>
            {/* Removed due to contract */}
          </p>
        </div>
        {
          (score !== null) ?
          ''
          :
          <div className="col-12 d-flex">
            <div className="ml-auto">
              <p className='whiteText mb-0'>Change Role</p>
              <select name="arch-role-select" id="arch-role-select"
                onChange={e => setArchRole(e.target.value)}
                className='em-c-select'
                value={archRole}
              >
                <option value=""></option>
                <option value="Capability Architect">Capability Architect</option>
                <option value="Domain Architect">Domain Architect</option>
                <option value="Solution Architect">Solution Architect</option>
                <option value="System Architect">System Architect</option>
              </select>
            </div>
          </div>
        }
      </div>
      
      { (score !== null) ? //need to use null for score because score can be 0 and UI changes after a score is calculated
        <div className='row pageSection'>
          <GameFeedback
            score={score}
            feedback={feedback}
            setDesc={setDesc}
            desc={desc}
            maxScore={maxScore}
          />
          <div className="col-12 d-flex justify-content-center">
            <button
              onClick={() => {
                setScore(null);
                setDesc('');
                setFeedback([]);
                setSelections([]);
                getFreshData(archRole, setAnswers, setChoices, setMaxScore)
              }}
              className='em-c-btn em-c-btn--primary mt-4'
            >
              Start Over
            </button>
          </div>
        </div>
        : //if no score, check for arch role; if not in arch directory, user is prompted to select a role
        <div className='row pageSection em-c-text-passage'>
          { archRole ?
            <div className='col-12'>
              <div className="centerText">
                <h1>Welcome {props.userInfo.account.name.split(' ')[1]}!</h1>
                <h2 className='mt-4'>{archRole} Challenge</h2>
                <Button 
                  color='link'
                  onClick={() => {
                    bootbox.alert({
                      message: {/* Removed due to contract */},
                      centerVertical: true,
                    });
                  }}
                >
                  Help
                </Button>
              </div>
              <div className="row">
                <div className="col-12 col-lg-6 mt-5">
                  <h4 className='centerText mt-0'>Architecture Tasks</h4>
                  <div className="taskBoard contentInner prettifyScrollBar">
                    {
                      choices.map(task => (
                        <div key={task.id}
                          onClick={e => {handleSelect(e.target, choices, selections, setSelections, setChoices)}}
                          className='d-flex pointer archTask blockWithShadow'
                        >
                          <p taskid={task.id} className='noClick mb-0 pr-2 pl-2'>{task.task}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="col-12 col-lg-6 mt-5">
                  <h4 className='centerText mt-0'>Things I Do in my Role</h4>
                  <div className="taskBoard contentInner prettifyScrollBar">
                    {
                      selections.map(task => (
                        <div key={task.id} 
                          className='d-flex flex-row justify-content-between archTask blockWithShadow'
                        >
                          <p taskid={task.id} className='noClick mb-0 pr-2 pl-2'>{task.task}</p>
                          <div
                            onClick={e => {handleRemoval(e.target, choices, selections, setSelections, setChoices)}}
                            className='pointer removeTaskBtn'
                          >
                            <FontAwesomeIcon icon={['fas', 'times']} className='noClick'/>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="centerText">
                    <button 
                      className='em-c-btn em-c-btn--primary mt-4'
                      onClick={() => gradeTest(choices, answers, selections, setScore, setFeedback)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className='wlaaNoRole pr-2 pl-2'>
              <p>
                {/* Removed due to contract */}
              </p>
              <select name="arch-role-select" id="arch-role-select"
                onChange={e => setArchRole(e.target.value)}
                className='mr-auto ml-auto em-c-select'
              >
                <option value=""></option>
                <option value="Capability Architect">Capability Architect</option>
                <option value="Domain Architect">Domain Architect</option>
                <option value="Solution Architect">Solution Architect</option>
                <option value="System Architect">System Architect</option>
              </select>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default GameStart;