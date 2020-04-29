import React, { Component } from 'react';
import Axios from 'axios';
import { sp } from "@pnp/sp";
import MeetingForm from "./MeetingForm";

var xml2js = require('xml-js');

class MeetingEntry extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      communityName: props.match.params.name,
      submitted: false,
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

    //this.getFormDigest();
    //this.getUserId();
  }

  //helper function to create form digest in state if needed
  getFormDigest = () => {
    Axios({
      method: 'POST',
      url: {/* Removed due to contract */},
      headers: {
        'Content-Type': 'application/json; odata=verbose',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
    .then(resp => {
      let xml = resp.data;
      let data = xml2js.xml2js(xml, {compact: true, spaces: 4})
      
      this.setState({
        xDigest: data["d:GetContextWebInformation"]["d:FormDigestValue"]._text
      }) 
    })
    .catch(err => {
      console.log(err)
    })
  }

  //Takes in array files that came from the form and adds them to Document Library
  sendFiles = (attachments) => {
    attachments.forEach(file => {
      if (file.size <= 10485760) {
        sp.web.getFolderByServerRelativeUrl("/sites/at/ea/OMA_Workspaces/").files.add(file.name, file, true)
      }
    })
  }

  //accepts formValues sent from formSubmit function
  //Set submitted to true to display sent confirmation, redirect after 2 seconds
  sendMeetingItem = (formValues) => {
    //create string of file names to add to meeting list item, will be used for lookup and display
    let fileNamesString = '';
    formValues.attachments.forEach(file => {
      fileNamesString += `${file}, `
    });

    // add an item to the list
    sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.add({
      Title: this.state.communityName,
      MeetingTitle: formValues.meetingTitle,
      MeetingDate: formValues.date,
      EndTime: formValues.endTime,
      Agenda: formValues.agenda,
      Attendees: formValues.attendees,
      Minutes: formValues.meetingMinutes,
      NextSteps: formValues.nextSteps,
      DecisionsMade: formValues.decisions,
      FileNames: fileNamesString,
    })
    .then(() => {
      this.setState({
        submitted: true,
      }, () => {
        setTimeout(() => {
          this.backToCommunityPage();
        }, 2000)
      })
    });
  }

  //accepts argument of form values sent from Formik onSubmit method in MeetingForm component
  //if there are attachments, send them to the document lib
  //then send the meeting list item
  formSubmit = (formValues) => {
    if (formValues.attachments) {
      this.sendFiles(formValues.attachments);
    }

    this.sendMeetingItem(formValues);
  }

  //helper function to lookup ID of user
  getUserId = () => {
    let user = 'Bissell, Robert /C'
    Axios({
      method: 'GET',
      headers: {
        'accept': 'application/json;odata=verbose', // JSON Lite should be available in SP1.  If not, use odata=verbose instead
        'content-type': 'application/json;odata=verbose' // same thing, replace with odata=verbose if this doesn't work
      },
      url: process.env.REACT_APP_SP_BASEURL + "/_api/web/SiteUserInfoList/items?$filter=Title eq '"+user+"'"
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }

  backToCommunityPage = () => {
    this.props.history.push(`/community/detail/${this.state.communityName}`)
  }
  
  render() {
    return (
      <div className='container subPage'>
        <div className="em-c-page-header">
          <h1 className="em-c-page-header__title">Create New Meeting</h1>
          <h3 className='sectionHeader'>Community: {this.state.communityName}</h3>
        </div>
        <MeetingForm 
          sendItem={this.formSubmit}
          handleCancel={this.backToCommunityPage}
          isEdit={false}
        />
        <div className={this.state.submitted ? "displayed sentMessageContainer" : "hidden sentMessageContainer"}>
          <p className='sentMessage'><i className="fas fa-check"></i>Submitted Successfully!</p>
          <p>Page will redirect in 2 seconds..</p>
        </div>
      </div>
    );
  }
}

export default MeetingEntry;