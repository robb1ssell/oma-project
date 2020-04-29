import React, { Component } from 'react';
import { sp } from "@pnp/sp";
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';

class MeetingDetails extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      communityName: props.match.params.name,
      meetingID: props.match.params.id,
      attachments: [],
    }
  }

  componentDidMount = () => {
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    this.getMeetingDetails();
  }

  getMeetingDetails = () => {
    let fileComps = [];

    sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.getById(this.state.meetingID).get()
    .then(item => {
      if (item.FileNames) {
        let filesArray = item.FileNames.split(', ').filter(el => el !== "");
        filesArray.forEach((el, i) => {
          if (el.length > 20) {
            fileComps.push(
              <li key={i}>
                <a 
                  href={el}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {`...${el.slice(-20)}`}
                </a>
              </li>
            );
          }
          else {
            fileComps.push(
              <li key={i}>
                <a 
                  href={el}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {el}
                </a>
              </li>
            );
          }
        });
      }

      this.setState({
        meeting: item,
        attachments: fileComps,
      })
    })
  }

  backToCommunityPage = () => {
    this.props.history.push(`/community/detail/${this.state.communityName}`)
  }
  
  sendToEdit = () => {
    this.props.history.push(`/community/detail/${this.state.communityName}/meeting/edit/${this.state.meetingID}`)
  }

  render() {
    return (
      <div className='container subPage showListBullets'>
        <div className="row">
          <div className="em-c-page-header col-12 col-lg-7">
            <h1>{this.state.meeting ? ReactHtmlParser(this.state.meeting.MeetingTitle) : ''}</h1>
            <h3 className='sectionHeader'>
              {this.state.meeting ?
                `
                  ${ReactHtmlParser(moment(this.state.meeting.MeetingDate).format('MM-DD-YYYY, h:mm A'))} - 
                  ${ReactHtmlParser(moment(this.state.meeting.EndTime).format('h:mm A'))}
                `
                : ''
              }
            </h3>
          </div>
          <div className="col-12 col-lg-5">
            <h3 className="sectionHeader">Key Decisions</h3>
            {this.state.meeting ? ReactHtmlParser(this.state.meeting.DecisionsMade) : ''}
          </div>
        </div>
        <div className="row pageSection">
          <div className="col-12 col-lg-8">
            <div className="row">
              <h3 className="sectionHeader">Agenda</h3>
              <div className="col-12 pad-bot-30 ql-editor">
                {this.state.meeting ? ReactHtmlParser(this.state.meeting.Agenda) : ''}
              </div>
              <h3 className="sectionHeader">Meeting Minutes</h3>
              <div className="col-12 pad-bot-30 ql-editor">
                {this.state.meeting ? ReactHtmlParser(this.state.meeting.Minutes) : ''}
              </div>
              <h3 className="sectionHeader">Next Steps</h3>
              <div className="col-12 pad-bot-30 ql-editor">
                {this.state.meeting ? ReactHtmlParser(this.state.meeting.NextSteps) : ''}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="row">
              <h3 className="sectionHeader">Attendees</h3>
              <div className="col-12">
                {this.state.meeting ? ReactHtmlParser(this.state.meeting.Attendees) : ''}
              </div>
            </div>
            <div className="row">
              <h3 className="sectionHeader">Attachments</h3>
              <div className="col-12">
                <ul className='fileLinkList'>
                  {this.state.attachments}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="formButtons em-c-btn-group">
          <button className="em-c-btn em-c-btn--secondary" onClick={this.backToCommunityPage}>
            <span className="em-c-btn__text">Back to {this.state.communityName} Workspace</span>
          </button>
          <button className="em-c-btn em-c-btn--secondary" onClick={this.sendToEdit}>
            <div className="em-c-btn__inner">
              {/* Removed due to contract */}
              <span className="em-c-btn__text">Edit This Meeting</span>
            </div>
          </button>
        </div>
      </div>
    );
  }
}

export default MeetingDetails;