import React, { Component } from 'react';
//import TrainingSections from './TrainingSections';
//import SolidCardListItem from '../SolidCardListItem';
//import CourseList from './CourseList';
import CourseSignUp from './CourseSignUp';
//import { UserAgentApplication } from "msal";
import TrainingCatergoryButtons from './TrainingCatergoryButtons';
//import { MsalAuthProviderFactory } from 'react-aad-msal';
//import { msalConfig, authParams } from '../../msalConfig';
//import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import CourseTile from './CourseTile';
import ScheduledTile from './ScheduledTile';
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint'
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'; //needed for bootbox
import * as bootbox from 'bootbox';
import ReactPaginate from 'react-paginate';

//constant for pagination; number of items per page
const perPage = 3;

class TrainLanding extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rawCourseData: [],
      displayedCourses: [],
      courseSection: 'For IT Architects',
      scheduledCourseOptions: [],
      scheduledCourses: [],
      courseSearchValue: '',
      courseDateValue: '',
      scheduledDateOptions: [],
      displayedScheduled: [],
      offset: 0, //tracker for where to start in the data based on what page we're on
      modalOpen: false,
    }

    this.showCourses = this.showCourses.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount = () => {
    document.title = 'OMA | Training Services'

    this.getCourseOfferings();
  }
  
  getCourseOfferings = () => {
    axios.get(
      process.env.REACT_APP_SP_BASEURL + "_api/web/lists/getByTitle('OMA_TrainingOfferings')/items",
      spConfig
    )
    .then(resp => {
      console.log(resp)
      this.setState({
        rawCourseData: resp.data.d.results,
      }, () => {
        this.getScheduledCourses();
        this.createDateOptions();
        this.displayCourses();
      })
    })
  }
  
  showCourses = (e) => {
    e.currentTarget.blur() //remove ugly button focus after click
    this.setState({
      courseSection: e.target.innerText,
    }, () => {
      this.displayCourses();
    })
  }

  displayCourses = () => {
    let courseComps = [];

    this.state.rawCourseData.forEach(el => {
      if (this.state.courseSection === 'For IT Architects') {
        if (el.ShowUnderArchitect) {
          courseComps.push(
            <CourseTile title={el.Title} key={el.ID}/>
          );
        }
      }

      if (this.state.courseSection === 'For Business Leaders') {
        if (el.ShowUnderBusiness) {
          courseComps.push(
            <CourseTile title={el.Title} key={el.ID}/>
          );
        }
      }

      if (this.state.courseSection === 'For Management / Supporting Roles') {
        if (el.ShowUnderManagement) {
          courseComps.push(
            <CourseTile title={el.Title} key={el.ID}/>
          );
        }
      }
    })

    this.setState({ displayedCourses: courseComps })
  }

  getScheduledCourses = () => {
    let uniqueOptions = [];
    let optionComps = [];
    let scheduled = [];

    axios.get(
      process.env.REACT_APP_SP_BASEURL + "_api/web/lists/getByTitle('OMA_Scheduled_Trainings')/items",
      spConfig
    )
    .then(resp => {
      //sort items chronologically
      const sortedItems = resp.data.d.results.sort((a, b) => {
        return moment(a.StartDate) - moment(b.StartDate)
      });

      sortedItems.forEach(el => {
        if (moment(el.StartDate) > moment()) {
          if (uniqueOptions.indexOf(el.Title) === -1) {
            uniqueOptions.push(el.Title);
          }
  
          scheduled.push(
            <ScheduledTile
              key={el.EventXLink}
              title={el.Title}
              location={el.Location}
              startDate={el.StartDate}
              endDate={el.EndDate}
              eventXLink={el.EventXLink}
            />
          )
        }
      })
      
      uniqueOptions.forEach(name => {
        optionComps.push(
          <option key={name} value={name}>{name}</option>
        );
      })

      let pageCount = Math.ceil(scheduled.length / perPage) //Set the number of pages for pagination
      
      this.setState({
        scheduledCourseOptions: optionComps,
        scheduledCourses: scheduled,
        pageCount: pageCount,
      }, () => {
        //this.setUpcomingTraining();
        this.updateDisplayedScheduled();
      })
    })
  }

  //creates option markup for date select -> current month + 11 months out
  createDateOptions = () => {
    let dates = [];

    for(let i = 0; i < 12; i++) {
      dates.push(
        <option key={i}>{moment().add(i, 'months').format('MMMM YYYY')}</option>
      );
    }

    this.setState({ scheduledDateOptions: dates })
  }

  //Uses offset calculated by selected page and perPage constant to know which data to display on which page
  updateDisplayedScheduled = () => {
    let lower = this.state.offset;
    let upper = this.state.offset + perPage;
    let displayed = [];

    this.state.scheduledCourses.forEach((el, index) => {
      if (index >= lower && index < upper) {
        displayed.push(el)
      }
    });

    this.setState({ displayedScheduled: displayed });
  }

  //Runs when the pagination is changed
  handlePageClick = data => {
    let offset = Math.ceil(data.selected * perPage);
    this.setState({
      offset: offset
    }, () => {
      this.updateDisplayedScheduled();
    });
  };

  //helper function to lookup ID of user
  getUserId = (formValues) => {
    axios({
      method: 'GET',
      headers: {
        'accept': 'application/json;odata=verbose', // JSON Lite should be available in SP1.  If not, use odata=verbose instead
        'content-type': 'application/json;odata=verbose' // same thing, replace with odata=verbose if this doesn't work
      },
      url: process.env.REACT_APP_SP_BASEURL + "_api/web/SiteUserInfoList/items?$filter=Title eq '"+formValues.name+"'"
    })
    .then(user => {
      this.addUserToWaitlist(formValues, user.data.d.results[0].ID);
    })
    .catch(err => {
      console.log(err)
    })
  }

  addUserToWaitlist = (formValues, spUserId) => {
    let courses = [
      `${formValues.arch101 ? 'Architecture 101 - 2 Day' : ''}`,
      `${formValues.busArch ? 'Business Architecture' : ''}`,
      `${formValues.wwa ? 'Working With Architects' : ''}`,
    ];
    let existingRecords = [];
    let coursesToSubmit = courses.filter(c => c !== '');

    axios.get(
      process.env.REACT_APP_SP_BASEURL + "_api/web/lists/getByTitle('OMA_TrainingRoster')/items",
      spConfig
    )
    .then(resp => {
      resp.data.d.results.forEach(el => {
        //if name is on roster and list item isn't marked as completed
        //compare to the courses selected by the user
        if (el.NameId === spUserId && el.Completed_x0020_Date === null) {
          coursesToSubmit.forEach(course => {
            if (course === el.Course_x0020_Name) {
              existingRecords.push(
                `<li>${course} - ${el.Preferred_x0020_Course_x0020_Loc}</li>`
              );
              coursesToSubmit = coursesToSubmit.filter(c => c !== course)
            }
          })
        }
      })

      let existingString = '';
      if (existingRecords.length > 0) {
        existingRecords.forEach(el => {
          existingString += el;
        })
      }

      console.log('courses to submit: '+coursesToSubmit)
      if (coursesToSubmit.length > 0) {
        let submittedCourseString = '';
        coursesToSubmit.forEach(c => {
          submittedCourseString += `<li>${c} - ${formValues.location}</li>`;
        });

        coursesToSubmit.forEach(course => {
          let data = {
            Title: `${formValues.name}-${course}`,
            NameId: spUserId,
            Course_x0020_Name: course,
            Preferred_x0020_Course_x0020_Loc: formValues.location,
          };
          axios.post(
            spListApiUrl('OMA_TrainingRoster'),
            data,
            spConfig
          )
          .then(iar => {
            console.log(iar);
          })
        })
        
        
        //if records existed already, but we also submitted a separate item that we didn't already have
        if (existingRecords.length > 0) {
          bootbox.alert({
            centerVertical: true,
            message: `
              <div class='showListBullets'>
              <p>We found existing records for part of your request.</p>
                <p>The following were submitted:</p>
                <ul class='pl-3 pb-2'>${submittedCourseString}</ul>
                <p>Existing Records Found (and not submitted):</p>
                <ul class='pl-3 pb-2'>${existingString}</ul>
                <p>Please<a class='cyanText' href={/* Removed due to contract */}> email Heidi Larsen </a>
                if you need to make a change.
                </p>
              </div>
            `
          })
        }
        //submitted correctly and no records existed
        else {
          bootbox.alert({
            centerVertical: true,
            message: `
              <div class='showListBullets'>
              <p>Submitted successfully:</p>
              <ul class='pl-3 pb-2'>${submittedCourseString}</ul>
              <p>Please<a class='cyanText' href={/* Removed due to contract */}> email Heidi Larsen </a>
              if you need to make a change.
              </p>
              </div>
              `
          })
        }
      }
      //nothing submitted because all choices already existed
      else {
        bootbox.alert({
          centerVertical: true,
          message: `
            <div class='showListBullets'>
              <p>We did not submit anything because we have existing records for you.</p>
              <p>Existing Records Found:</p>
              <ul class='pl-3 pb-2'>${existingString}</ul>
              <p>Please<a class='cyanText' href={/* Removed due to contract */}> email Heidi Larsen </a>
              if you need to make a change.
              </p>
            </div>
          `
        })
      }
    })

    this.closeModal();
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }
  
  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  render() {
    let filteredResults = this.state.scheduledCourses;
    
    if (this.state.courseSearchValue !== '') {
      filteredResults = filteredResults.filter(item => item.props.title === this.state.courseSearchValue)
    }

    if (this.state.courseDateValue !== '') {
      filteredResults = filteredResults.filter(item => moment(item.props.startDate).format('MMMM YYYY') === this.state.courseDateValue)
    }

    return (
      <div id="training" className="container-fluid noGutter">
        <div className="container subPage">
          <div className="row">
            <div className="col-12 col-xl-7">
              <div className="row">
                <div className="em-c-page-header">
                  <div className="col-sm-12">
                    <h1 className="em-c-page-header__title">Training Services</h1>
                  </div>
                  <div className="col-sm-12">
                    <p className='em-c-page-header__desc'>
                     {/* Removed due to contract */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-5 em-c-text-passage">
              <h2 className='mt-3'>What's in it for ExxonMobil?</h2>
              <p>
                {/* Removed due to contract */}
              </p>
            </div>
          </div>
          <div className='row pageSection'>
            <h2 className='col-sm-12 sectionHeader'>Why train with OMA?</h2>
            <div className="col-sm-12 pageSection">
              <div className="row">
                <div className="col-sm-3 whyBox">
                  {/* Removed due to contract */}
                </div>
                <div className="col-sm-3 whyBox">
                  {/* Removed due to contract */}
                </div>
                <div className="col-sm-3 whyBox">
                  <div className="whyIcon">
                    <img 
                      src="https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/geek-out-icon.jpg" 
                      alt="geek-out-icon"
                    />
                  </div>
                  <h6>Geek out with peers</h6>
                  <p>
                    Level up your architecture game with practical, hands-on exercises
                  </p>
                </div>
                <div className="col-sm-3 whyBox">
                  {/* Removed due to contract */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-12 col-md-6">
                  <h3 className="sectionHeader">Training Courses</h3>
                  {/* Removed due to contract */}
                </div>
                <div className="col-12 col-md-6 centerText">
                  <CourseSignUp 
                    user={this.props.userInfo}
                    courseData={this.state.rawCourseData} 
                    addUser={this.getUserId}
                    modalOpen={this.state.modalOpen}
                    openModal={this.openModal}
                    closeModal={this.closeModal}
                  />
                </div>
              </div>
              <TrainingCatergoryButtons
                showCourses={this.showCourses}
                activeSection={this.state.courseSection}
              />
              {this.state.displayedCourses}
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-12-col-lg-6">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <h3 className="sectionHeader">Scheduled Trainings</h3>
                      {/* Removed due to contract */}
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="col-12-col-lg-6 ml-auto d-flex flex-wrap">
                        <select 
                          name="sched-trainings" 
                          id="sched-trainings" 
                          className='em-c-select pb-0 pt-0 scheduledSelect' 
                          onChange={e => this.setState({ courseSearchValue: e.target.value })}
                        >
                          <option value="">Course Options</option>
                          {this.state.scheduledCourseOptions}
                        </select>
                        <select 
                          name="sched-dates" 
                          id="sched-dates" 
                          className='em-c-select pb-0 pt-0 scheduledSelect' 
                          onChange={e => this.setState({ courseDateValue: e.target.value })}
                        >
                          <option value="">Date</option>
                          {this.state.scheduledDateOptions}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {!this.state.courseDateValue && !this.state.courseSearchValue ? 
                  <p className='ml-auto mr-auto mb-0 mt-2'>
                    Only showing next upcoming trainings. Select filters to narrow your search.
                  </p>
                  :
                  ''
                }
              </div>
              <div className="row">
                <div id='scheduled-training' 
                  className={`${this.state.courseSearchValue || this.state.courseDateValue ? '':'scheduledTrainingOverflow'} 
                    col-12 pt-4`
                  }
                >
                  {this.state.courseSearchValue || this.state.courseDateValue ?
                    filteredResults 
                    :
                    this.state.displayedScheduled ? this.state.displayedScheduled :
                    this.state.courseSearchValue ? 
                      <p className='centerText'>
                        No courses of this type are scheduled for the selected date
                      </p>
                      : 
                      this.state.courseDateValue ?
                        <p className='centerText'>
                          No courses are scheduled for the date you selected
                        </p>
                        :
                        ''
                  }
                </div>
                <ReactPaginate
                  previousLabel={
                    {/* Removed due to contract */}
                  }
                  nextLabel={
                    {/* Removed due to contract */}
                  }
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={`${this.state.courseDateValue || this.state.courseSearchValue ? 'hidden': ''} em-c-pagination meetingPagination`}
                  pageClassName={'em-c-pagination__item pointer'}
                  pageLinkClassName={'em-c-pagination__link pointer'}
                  activeLinkClassName={'em-is-current'}
                  previousClassName={'em-c-pagination__item pointer'}
                  previousLinkClassName={'em-c-pagination__link pointer'}
                  nextClassName={'em-c-pagination__item pointer'}
                  nextLinkClassName={'em-c-pagination__link pointer'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrainLanding;