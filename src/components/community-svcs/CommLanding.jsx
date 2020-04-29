import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CommunityItem from './meetings/CommunityItem';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ReactPaginate from 'react-paginate';
import SearchInput, { createFilter } from 'react-search-input';
import ArchitectsAnglePreview from './arch-angle/ArchitectsAnglePreview';
import { sp } from "@pnp/sp";
import ReactHtmlParser from 'react-html-parser'
import ArchDirBlock from './ArchDirBlock';

//needed for SearchInput's createFilter
//search bar will only filter on props of card that are listed here
const KEYS_TO_FILTERS = [
  'props.title',
  'props.contactList.name'
];

//constant for pagination; number of items per page
const perPage = 5;

const communityFeedbackEmail = `` //removed for contract

//import { MsalAuthProviderFactory } from 'react-aad-msal';
//import { msalConfig, authParams } from '../../msalConfig';
//import { UserAgentApplication } from "msal";
//import { MSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProvider";
//import { Client } from "@microsoft/microsoft-graph-client";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
// month is 0 index, 24h time format, (year, month, day, hour, minute, seconds)

class CommLanding extends Component {
  constructor(props) {
    super(props)

    this.state = {
      AAdate: moment().format('MMMM YYYY'),
      searchTerm: '',
      communities: [],
      displayedCommunities: [],
      offset: 0, //tracker for where to start in the data based on what page we're on
      archiveStartID: 1,
      calendarEvents: [],
    }
  }

  componentDidMount = () => {
    document.title = 'OMA | Community Home'
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    axios({
      headers: {
        'accept': "application/json;odata=verbose",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'GET',
      url: {/* Removed due to contract */}
    })
    .then((response) => {
      //console.log(response.data.d.results);
      let communityComps = [];
      let sortedComms = response.data.d.results;

      sortedComms.sort((a, b) => {
        return a.SortingID - b.SortingID;
      })
      
      //For each result returned, loop each contact to compile contacts array
      //Create each community item for the list, passing respective props
      sortedComms.forEach((el) => {
        let contacts = [];
        for (let index = 0; index < el.PointOfContact.results.length; index++){
          //format out middle initial and reorder name to first last
          let name = el.PointOfContact.results[index].Name.split(' ');
          let fname = name[1];
          let lname = name[0].substring(0, name[0].lastIndexOf(','));

          let lanID = el.PointOfContact.results[index].LANID;
          let region = '';
          if (lanID) {
            region = lanID.substring(0, lanID.lastIndexOf("\\"));
          }

          contacts.push(
            {
              name: `${fname} ${lname}`,
              pic: {/* Removed due to contract */},
              profile: {/* Removed due to contract */},
              sip: el.PointOfContact.results[index].SIPAddress,
              email: el.PointOfContact.results[index].WorkEmail
            }
          );
        }
        
        //create UI for list of communities on Community Home
        if (el.SeparateWorkspace !== null) {
          communityComps.push(
            <CommunityItem
              key={el.CommunityName}
              title={el.CommunityName}
              contactList={contacts}
              pathToPage={ReactHtmlParser(el.SeparateWorkspace)}
              external={true}
              noPic={{/* Removed due to contract */}}
            />
            );
          }
        else {
          communityComps.push(
            <CommunityItem
              key={el.CommunityName}
              title={el.CommunityName}
              contactList={contacts}
              pathToPage={`/community/detail/${el.CommunityName}`}
              external={false}
              noPic={{/* Removed due to contract */}}
            />
          );
        }
      });//end of forEach
      //this.fetchTest();
      let pageCount = Math.ceil(communityComps.length / perPage) //Set the number of pages for pagination

      this.setState({
        communities: communityComps,
        pageCount: pageCount,
      }, () => {
        this.showCommunities();
        this.setArchiveStartID();
        this.createCalendarEvents();
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  //Uses offset calculated by selected page and perPage constant to know which data to display on which page
  showCommunities = () => {
    let lower = this.state.offset;
    let upper = this.state.offset + perPage;
    let communitiesToDisplay = [];

    this.state.communities.forEach((el, index) => {
      if (index >= lower && index < upper) {
        communitiesToDisplay.push(el)
      }
    });

    this.setState({ displayedCommunities: communitiesToDisplay });
  }

  //Runs when the pagination is changed
  handlePageClick = data => {
    let offset = Math.ceil(data.selected * perPage);
    this.setState({
      offset: offset
    }, () => {
      this.showCommunities();
    });
  };

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  //goes through the archive and gets the current month's items
  //from those, set the correct starting item to correspond with current month in archive view
  setArchiveStartID = () => {
    let currentMonthItems = [];
    let startItem = null;

    //if it stops working, add new month's items
    sp.web.lists.getByTitle("OMA_Architects_Angle_Archive").items.get()
    .then(items => {
      items.forEach(el => {
        if (moment(el.Date).format('MMMM YYYY') === this.state.AAdate) {
          currentMonthItems.unshift(el); //unshift to match order of archive
        }
      })

      if (currentMonthItems.length === 0) {
        items.forEach(el => {
          if (moment(el.Date).format('MMMM YYYY') === moment(this.state.AAdate).subtract(1, 'month').format('MMMM YYYY')) {
            currentMonthItems.unshift(el); //unshift to match order of archive
          }
        })
        startItem = currentMonthItems.slice(-1)[0]; //gets the last item of the array
      }
      else {
        startItem = currentMonthItems.slice(-1)[0]; //gets the last item of the array
      }

      this.setState({
        archiveStartID: startItem.ID,
      })
    })
  }

  createCalendarEvents = () => {
    let eventData = [];
    sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.select('Title', 'MeetingTitle', 'MeetingDate', 'EndTime').get()
    .then(items => {
      items.forEach(el => {
        eventData.push(
          {
            title: el.Title + ' - ' + el.MeetingTitle,
            start: new Date(el.MeetingDate),
            end: new Date(el.EndTime),
          }
        );
      });
      
      this.setState({ calendarEvents: eventData });
    });
  }

  render() {
    //filter on what is in the search bar
    let filteredResults = this.state.communities.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

    return (
      <div id="community">
        <div className="container subPageHeading em-c-page-header">
          <div className="row pageSection">
            <div className="col-12 col-xl-6">
              {/*
              <div className="em-c-promo-block">
                <h2 className="em-c-promo-block__title">techconnect is live!</h2>
                <p className="em-c-promo-block__desc">
                  Head over and see what architecture coaching opportunities are available!
                </p>
                <div className="em-c-promo-block__actions">
                  <div className="em-c-btn-group em-c-btn-group--responsive">
                    <Link to='/community/techconnect'>
                      <button className="em-c-btn em-c-btn--primary">
                        <span className="em-c-btn__text">Learn More</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              */}
              <div id='arch-angle-preview' className="">
                <div className="flex muted flex-wrap">
                  <h4 className="sectionHeader">Architect's Angle - {this.state.AAdate}</h4>
                  <Link to={`/community/AAArchive/display/${this.state.archiveStartID - 1}`} className='ml-auto'>View Archive</Link>
                </div>
                <ArchitectsAnglePreview activeMonth={this.state.AAdate}/>
              </div>
              <div id='ea-calendar' className="mt-4">
                <h4 className="sectionHeader">EA Calendar</h4>
                <BigCalendar
                  localizer={localizer}
                  events={this.state.calendarEvents}
                  min={new Date(2019, 5, 0, 7, 0, 0)}
                  max={new Date(2030, 11, 0, 19, 0, 0)}
                  views={['month', 'work_week', 'day', 'agenda']}
                  defaultView={'agenda'}
                  defaultDate={new Date()}
                  popup
                />
              </div>
            </div>

            <div id='looking-for-arch' className="col-12 col-xl-6">
              <ArchDirBlock/>
              <div className="mt-4">
                <div id='community-list-header' className="flex flex-col justify-sb">
                  <div className='muted'>
                    <h4 className="sectionHeader">Communities list</h4>
                    <a href={`mailto:removed due to contract?subject=Community Page Inquiry&body=${communityFeedbackEmail}`}>Questions? Need to Add/Delete Info?</a>
                  </div>
                  <SearchInput onChange={this.searchUpdated} placeholder='Community Search'/>
                </div>
                <div id="communities-container" className={`${this.state.searchTerm ? 'containerOverflow' : ''} hideScrollBar`}>
                  <ul className="em-c-tile-list em-l-grid em-l-grid--1up">
                    {this.state.searchTerm ? filteredResults : this.state.displayedCommunities}
                  </ul>
                </div>
                <ReactPaginate
                  previousLabel={
                    <svg className="em-c-icon em-c-icon--small em-c-pagination__icon" data-em-icon-path={/* Removed due to contract */}>
                      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={/* Removed due to contract */}></use>
                    </svg>
                  }
                  nextLabel={
                    <svg className="em-c-icon em-c-icon--small em-c-pagination__icon" data-em-icon-path={/* Removed due to contract */}>
                      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={/* Removed due to contract */}></use>
                    </svg>
                  }
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={`${this.state.searchTerm ? 'hidden': ''} em-c-pagination meetingPagination`}
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

export default CommLanding;