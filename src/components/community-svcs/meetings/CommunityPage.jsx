import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import CommContact from './CommContact';
import MeetingItem from './MeetingItem';
import { Link } from 'react-router-dom';
import { sp } from "@pnp/sp";
import ReactPaginate from 'react-paginate';

//constant for pagination; number of items per page
const perPage = 5;

class CommunityPage extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      communityName: props.match.params.name,
      activeCommunity: {},
      contacts: [],
      allMeetings: [],
      displayedMeetings: [],
      offset: 0, //tracker for where to start in the data based on what page we're on
    }
  }

  //set up SP util, then axios call to get correct community
  //sets active community in state, then on callback, displays contacts' info and gets community meetings
  componentDidMount = () => {
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
      response.data.d.results.forEach(el => {
        if (el.CommunityName === this.state.communityName) {
          this.setState({
            activeCommunity: el
          }, () => {
            this.populateContacts();
            this.getCommunityMeetings();
          })
        }
      }) //end of foreach
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //create contact components based on the current community
  //called from callback on setState in componentDidMount
  populateContacts = () => {
    let contactComps = [];
    this.state.activeCommunity.PointOfContact.results.forEach(el => {
      let name = el.Name.split(' ');
      let fname = name[1];
      let lname = name[0].substring(0, name[0].lastIndexOf(','));
      let lanID = el.LANID;
      let region = '';
      if (lanID) {
        region = lanID.substring(0, lanID.lastIndexOf("\\"));
      }

      contactComps.push(
        <CommContact
          key={el.WorkEmail}
          contactName={`${fname} ${lname}`}
          profilePicture={{/* Removed due to contract */}}
          profileLink={{/* Removed due to contract */}}
          pathToPage={`/community/detail/${el.CommunityName}`}
          noPic={{/* Removed due to contract */}}
          sip={el.SIPAddress}
          email={el.WorkEmail}
        />
      )
    });

    this.setState({
      contacts: contactComps
    })
  }

  //Uses sharepoint util defined above to get only the meeting items that match the community name
  //Called in callback of setState in componentDidMount
  getCommunityMeetings = () => {
    let meetingComps = [];
    sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.filter(`Title eq '${this.state.communityName}'`).get()
    .then((items) => {
      //console.log(items)
      let sortedMeetings = items.sort((a, b) => {
        return a.MeetingDate - b.MeetingDate
      })

      sortedMeetings.forEach(el => {
        meetingComps.unshift( //show most recent first via unshift
          <MeetingItem
            key={el.ID}
            meetingDate={el.MeetingDate}
            meetingTitle={el.MeetingTitle}
            pathToPage={`/community/detail/${el.Title}/meeting/display/${el.ID}`}
          />
        )
      }) //end of foreach

      let pageCount = Math.ceil(meetingComps.length / perPage) //Set the number of pages for pagination
      this.setState({
        allMeetings: meetingComps, //hold all of the meetings here so we only use 1 http request
        pageCount: pageCount,
      }, () => {
        this.showCommunityMeetings(); //use callback here to decide which meetings to show
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  //Uses offset variable to determine which meetings to display
  //called from setState callback in getCommunityMeetings
  showCommunityMeetings = () => {
    let lower = this.state.offset;
    let upper = this.state.offset + perPage;
    let displayedMeetings = [];

    this.state.allMeetings.forEach((el, index) => {
      if (index >= lower && index < upper) {
        displayedMeetings.push(el)
      }
    });

    this.setState({ displayedMeetings: displayedMeetings });
  }

  //Click handler for pagination - data component just sends 0th index of page # selected
  //Recalculates offset based on selected page and perPage constant
  //Callback to redetermine which meetings to show after setting state with the new offset
  handlePageClick = data => {
    let offset = Math.ceil(data.selected * perPage);
    this.setState({
      offset: offset
    }, () => {
      this.showCommunityMeetings();
    });
  };

  render() {
    return (
      <div className='container-fluid noGutter'>
        <div className="row pageHeaderBlueBG">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-8 whiteText">
                <h1 className="em-c-page-header__title">{this.state.communityName} Workspace</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row pageSection">
            <div className="col-12 col-lg-6">
              <h3 className="sectionHeader">Recent Meetings</h3>
              <div className='flex justify-sb'>
                <h5>Meeting Frequency: {this.state.activeCommunity.MeetingFrequencyValue}</h5>
                <Link to={`/community/detail/${this.state.communityName}/meeting/create`}>
                  <button className="em-c-btn">
                    <div className="em-c-btn__inner">
                      {/* Removed due to contract */}
                      <span className="em-c-btn__text">New Meeting</span>
                    </div>
                  </button>
                </Link>
              </div>
              <ul className="em-c-tile-list em-l-grid em-l-grid--1up">
                {this.state.displayedMeetings}
              </ul>
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
                containerClassName={'em-c-pagination meetingPagination'}
                pageClassName={'em-c-pagination__item pointer'}
                pageLinkClassName={'em-c-pagination__link pointer'}
                activeLinkClassName={'em-is-current'}
                previousClassName={'em-c-pagination__item pointer'}
                previousLinkClassName={'em-c-pagination__link pointer'}
                nextClassName={'em-c-pagination__item pointer'}
                nextLinkClassName={'em-c-pagination__link pointer'}
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="row">
                <div className="col-12 em-c-text-passage">
                  <h3 className="sectionHeader mb-2 mt-0">Community Information</h3>
                  {ReactHtmlParser(this.state.activeCommunity.Charter_or_Purpose)}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <h3 className="sectionHeader mt-4 mb-2">Community Contact(s)</h3>
                  <div className="width-50">
                    {this.state.contacts}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-center-bottom">
            <Link to={`/community/home`}>
              <button className="em-c-btn em-c-btn--secondary">
                <span className="em-c-btn__text">Back to Community Home</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CommunityPage;