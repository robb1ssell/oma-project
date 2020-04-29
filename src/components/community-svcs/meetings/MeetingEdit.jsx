import React, { Component } from 'react';
import { sp } from "@pnp/sp";
import MeetingForm from "./MeetingForm";

class MeetingEdit extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      communityName: props.match.params.name,
      meetingID: props.match.params.id,
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

  //Takes in array files that came from the form and adds them to Document Library
  sendFiles = (attachments) => {
    attachments.forEach(file => {
      if (file.size <= 10485760) { //10 MB
        sp.web.getFolderByServerRelativeUrl("/sites/at/ea/OMA_Workspaces/").files.add(file.name, file, true)
      }
    })
  }

  updateMeetingItem = (formValues, existingFiles) => {
    //create string of file names to add to meeting list item, will be used for lookup and display
    let fileNamesString = '';
    //check if we have new attachments. if so, create new string for upload to match new attachments
    if (formValues.attachments) {
      formValues.attachments.forEach(file => {
        fileNamesString += `${file}, `
      });
      
      // update the item already in the list
      sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.getById(this.state.meetingID).update({
        MeetingTitle: formValues.meetingTitle,
        MeetingDate: formValues.date,
        EndTime: formValues.endTime,
        Agenda: formValues.agenda,
        Attendees: formValues.attendees,
        Minutes: formValues.meetingMinutes,
        NextSteps: formValues.nextSteps,
        DecisionsMade: formValues.decisions,
        FileNames: fileNamesString,
      }).then(() => {
        this.setState({
          submitted: true,
        }, () => {
          setTimeout(() => {
            this.backToMeetingPage();
          }, 2000)
        })
      });
    } 
    //attachments is blank, take it out of the update so we don't overwrite existing files, if any
    //existingFiles is just the array of file names passed from the form so we can create links to them
    //no need to handle files here because here they are unchanged.
    else if (existingFiles) { 
      existingFiles.forEach(file => {
        fileNamesString += `${file}, `
      });

      // update the item except FileNames
      sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.getById(this.state.meetingID).update({
        MeetingTitle: formValues.meetingTitle,
        MeetingDate: formValues.date,
        EndTime: formValues.endTime,
        Agenda: formValues.agenda,
        Attendees: formValues.attendees,
        Minutes: formValues.meetingMinutes,
        NextSteps: formValues.nextSteps,
        DecisionsMade: formValues.decisions,
        FileNames: fileNamesString,
      }).then(() => {
        this.setState({
          submitted: true,
        }, () => {
          setTimeout(() => {
            this.backToMeetingPage();
          }, 2000)
        })
      });
    }
    //attachments existed and were deleted - set file name string to null and submit
    else {
      fileNamesString = '';

      sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.getById(this.state.meetingID).update({
        MeetingTitle: formValues.meetingTitle,
        MeetingDate: formValues.date,
        EndTime: formValues.endTime,
        Agenda: formValues.agenda,
        Attendees: formValues.attendees,
        Minutes: formValues.meetingMinutes,
        NextSteps: formValues.nextSteps,
        DecisionsMade: formValues.decisions,
        FileNames: fileNamesString,
      }).then(() => {
        this.setState({
          submitted: true,
        }, () => {
          setTimeout(() => {
            this.backToMeetingPage();
          }, 2000)
        })
      });
    }
  }

  //accepts argument of form values sent from Formik onSubmit method in MeetingForm component
  //if there are attachments, send them to the document lib
  //then send the meeting list item
  formSubmit = (formValues, existingFiles) => {
/**
    if (formValues.attachments) {
      this.sendFiles(formValues.attachments);
    }
*/
    this.updateMeetingItem(formValues, existingFiles);
  }

  toggleDecisions = () => {
    this.setState({
      decisionsVisible: !this.state.decisionsVisible
    })
  }

  backToMeetingPage = () => {
    this.props.history.push(`/community/detail/${this.state.communityName}/meeting/display/${this.state.meetingID}`)
  }
  
  render() {
    return (
      <div className='container subPage'>
        <div className="em-c-page-header">
          <h1 className="em-c-page-header__title">Edit Meeting</h1>
        </div>
        <MeetingForm 
          sendItem={this.formSubmit}
          handleCancel={this.backToMeetingPage}
          isEdit={true}
          meetingID={this.state.meetingID}
        />
        <div className={this.state.submitted ? "displayed sentMessageContainer" : "hidden sentMessageContainer"}>
          <p className='sentMessage'><i className="fas fa-check"></i>Submitted Successfully!</p>
          <p>Page will redirect in 2 seconds..</p>
        </div>
      </div>
    );
  }
}

export default MeetingEdit;