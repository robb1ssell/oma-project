import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Col, Form, Button, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sp } from "@pnp/sp";
//import Dropzone from "react-dropzone";
import * as yup from 'yup';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'; //needed for bootbox
import * as bootbox from 'bootbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object({
  meetingTitle: yup.string().required(),
});

class MeetingForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      meeting: {},
      meetingTitle: '',
      meetingDate: new Date(),
      initialAgenda: '',
      initialAttendees: '',
      initialMinutes: '',
      initialNextSteps: '',
      initialDecisions: '',
      initialFiles: [],
      initialFileNames: [],
      files: null,
      fileLinks: [],
    };

    this.populateForm = this.populateForm.bind(this);
    this.attachmentConfirmation = this.attachmentConfirmation.bind(this);
    this.checkIfDifferentFiles = this.checkIfDifferentFiles.bind(this);
    this.submitFormProcess = this.submitFormProcess.bind(this);
    this.removeAttachmentLink = this.removeAttachmentLink.bind(this);
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

    //flag set in props of component - if true, we get the data from SharePoint
    //false would mean we are in create new meeting instead of edit, and we don't perform any of this
    if (this.props.isEdit === true) {
      this.getMeetingDetails();
    }
  }

  //grabs data of meeting using ID in props. On callback of set state, populates form
  //only runs if edit flag is true
  getMeetingDetails = () => {
    sp.web.lists.getByTitle("OMA_CommunitiesWorkspace").items.getById(this.props.meetingID).get()
    .then(item => {
      this.setState({
        meeting: item
      }, () => {
        //console.log(this.state.meeting)
        this.populateForm();
      })
    })
  }

  //called if we are in edit form and after state is set with current meeting
  populateForm = () => {
    let meetingDate = new Date(this.state.meeting.MeetingDate);
    let meetingEndTime = new Date(this.state.meeting.EndTime);

    //Each textbox has it's own ref
    //Data grabbed from SharePoint Rich Text Field via API is HTML string
    //use method of Quill API that pastes html in each editor
    //Each quill creates it's own html that we will return to SharePoint via the form
    let agendaQuill = this.agendaQuillRef.getEditor();
    agendaQuill.clipboard.dangerouslyPasteHTML(this.state.meeting.Agenda)

    let attendeesQuill = this.attendeesQuillRef.getEditor();
    attendeesQuill.clipboard.dangerouslyPasteHTML(this.state.meeting.Attendees)

    let minutesQuill = this.minutesQuillRef.getEditor();
    minutesQuill.clipboard.dangerouslyPasteHTML(this.state.meeting.Minutes)

    let nextStepsQuill = this.nextStepsQuillRef.getEditor();
    nextStepsQuill.clipboard.dangerouslyPasteHTML(this.state.meeting.NextSteps)

    let decisionsQuill = this.decisionsQuillRef.getEditor();
    decisionsQuill.clipboard.dangerouslyPasteHTML(this.state.meeting.DecisionsMade)

    //When we directly set values of editors above, the changes are not tracked by Formik
    //We select the contents of each editor, and the set our own state that we use to initialize Formik
    //See Formik below - initialValues start as null, but enableReinitialize flag = true and it
    //refills form if initialValues change, so:
    //setting state here => re render => form displays newly set initialValues
    let agendaContent = document.querySelector('#meeting-agenda .ql-editor').innerHTML;
    let attendeesContent = document.querySelector('#meeting-attendees .ql-editor').innerHTML;
    let minutesContent = document.querySelector('#meeting-minutes .ql-editor').innerHTML;
    let nextStepsContent = document.querySelector('#meeting-next-steps .ql-editor').innerHTML;
    let decisionsContent = document.querySelector('#meeting-decisions .ql-editor').innerHTML;

    this.setState({
      meetingTitle: this.state.meeting.MeetingTitle,
      meetingDate: meetingDate,
      meetingEndTime: meetingEndTime,
      initialAgenda: agendaContent,
      initialAttendees: attendeesContent,
      initialMinutes: minutesContent,
      initialNextSteps: nextStepsContent,
      initialDecisions: decisionsContent,
    }, () => {
      this.getFiles("/sites/at/ea/OMA_Workspaces"); //get files after state has been set above
    });
  }

  //When files are added, re render is invoked to display file information
  //If there is info in fields, we must track it in our own state to fill the form again
  updateStateFromForm = (files, values) => {
    this.setState({
      meetingTitle: values.meetingTitle,
      meetingDate: values.date,
      initialAgenda: values.agenda,
      initialAttendees: values.attendees,
      initialMinutes: values.meetingMinutes,
      initialNextSteps: values.nextSteps,
      initialDecisions: values.decisions,
      files: files
    })
  }

  //gets files from SP and creates an array of both the files and of just the files' names
  getFiles = (folderUrl) => {
    let filesToDisplay = [];
    if (this.state.meeting.FileNames !== null) {
      let filesArray = this.state.meeting.FileNames.split(', ').filter(el => el !== "");
      sp.web.getFolderByServerRelativeUrl(folderUrl).expand("Files").get()
      .then(res => {
        res.Files.results.forEach(el => {
          if (filesArray.includes(el.Name)) {
            filesToDisplay.push(el)
          }
        })
  
        this.setState({
          initialFiles: filesToDisplay,
          fileLinks: filesArray,
        })
      });
    }
  }

  //start of form submit process when there are existing files associated with the meeting
  fileSubmitProcess = (values, actions, existingFiles) => {
    let fileFound = false; //need a found flag to control confirm logic

    sp.web.getFolderByServerRelativeUrl("/sites/at/ea/OMA_Workspaces").expand("Files").get()
    .then(res => {
      res.Files.results.forEach(file => {
        this.state.files.forEach(el => {
          if (file.Name === el.name) {
            fileFound = true;
            bootbox.confirm({
              centerVertical: true,
              message: `A file named ${file.Name} already exists in our document library. Would you like to overwrite it?`,
              buttons: {
                confirm: {
                  label: 'Yes',
                  className: 'btn-success'
                },
                cancel: {
                  label: 'No',
                  className: 'btn-danger'
                }
              },
              callback: (result) => this.checkIfDifferentFiles(result, values, actions, existingFiles)
            });
          }
        })
      })

      //Did not find a file with the same name in the library, still need to check if list is different from existing
      if (fileFound === false) {
        this.checkIfDifferentFiles(true, values, actions, existingFiles);
      }
    })
  }
  
  //Callback for overwrite confirmation. If user clicks no, exit flow. Otherwise, evaluate difference in added files vs existing files
  //If files exist and new files do not match, ask user to confirm overwrite. If there is no difference, submit form
  //If file list is different, handle user input with callback
  checkIfDifferentFiles = (result, values, actions, existingFiles) => {
    if (result === false) {
      return;
    }
    else {
      if (values.attachments.length > 0 && existingFiles.length > 0) {
        let difference = values.attachments.filter(file => !existingFiles.includes(file.name));
        if (difference.length > 0) {
          bootbox.confirm({
            centerVertical: true,
            title: "Attachments",
            message: 'You are submitting a different list of Attachments. ' + 
            'This will overwrite all existing attachments on this meeting.',
            buttons: {
              cancel: {
                label: '<i class="fa fa-times"></i> Cancel'
              },
              confirm: {
                label: '<i class="fa fa-check"></i> Confirm'
              }
            },
            callback: (result) => this.attachmentConfirmation(result, values, actions, existingFiles)
          });
        }
        //No difference in attachments, submit form
        else {
          this.submitFormProcess(values, actions, existingFiles);
        }
      }
      //Nothing to compare, submit form
      else {
        this.submitFormProcess(values, actions, existingFiles);
      }
    }
  }

  //callback function for confirmation when attachments don't match during editing
  attachmentConfirmation = (result, values, actions, existingFiles) => {
    if (result === false) {
      return;
    }
    else {
      this.submitFormProcess(values, actions, existingFiles);
    }
  }
  
  //helper function for repeating actions. sets form attribute to false because it is post submit and call sendItem from parent
  submitFormProcess = (values, actions, existingFiles) => {
    actions.setSubmitting(false);
    this.props.sendItem(values, existingFiles);
  }

  //Controls adding links to the meeting via user input. We store links and not files to prevent storing multiple copies of files
  //Gets user input, does some checking for http protocol and adds to state if not a duplicate
  addAttachmentLink = () => {
    let linkInput = document.getElementById("attachment-input");
    let validString = '';

    if (linkInput.value === '') {
      bootbox.alert({
        message: "Can't add a link that is blank.",
        centerVertical: true,
      });
    }
    else {
      if (linkInput.value.slice(0, 8) === 'https://') {
        validString = linkInput.value;
      }
      else if (linkInput.value.slice(0, 7) !== 'http://') {
        validString = 'http://' + linkInput.value;
      }
      else {
        validString = linkInput.value;
      }
  
      if (this.state.fileLinks.indexOf(validString) === -1) {
        this.setState({
          fileLinks: [...this.state.fileLinks, validString],
        }, () => {
          linkInput.value = ''; //clear input after we add to state
        })
      }
      else {
        bootbox.alert({
          message: "No need for duplicate links.",
          centerVertical: true,
        });
      }
    }
  }

  removeAttachmentLink = (e) => {
    let currentLinks = [...this.state.fileLinks];
    let index = currentLinks.indexOf(e);
    if (index !== -1) {
      currentLinks.splice(index, 1);
      this.setState({ fileLinks: currentLinks });
    }
  }
  
  render() {
    let fileLinks = [];
    if (this.state.fileLinks.length > 0) {
      fileLinks = this.state.fileLinks.map(file => {
        if (file.length > 20) {
          return(
            <li key={file} className='d-flex flex-row align-items-center'>
              <a 
                href={file} 
                target='_blank' 
                rel='noopener noreferrer'
              >
              {`...${file.slice(-20)}`}
              </a>
              <div className="pointer ml-auto" onClick={() => this.removeAttachmentLink(file)}>
                <FontAwesomeIcon 
                  icon={['fas', 'times']}
                />
              </div>
            </li>
          );
        }
        else {
          return(
            <li key={file} className='d-flex flex-row align-items-center'>
              <a href={file} target='_blank' rel='noopener noreferrer'>{file}</a>
              <div className="pointer ml-auto" onClick={() => this.removeAttachmentLink(file)}>
                <FontAwesomeIcon 
                  icon={['fas', 'times']}
                />
              </div>
            </li>
          );
        }
      });
    }

    return (
      <Formik
        onSubmit={(values, actions) => {
         this.submitFormProcess(values, actions);
        }}
        initialValues={{
          meetingTitle: this.state.meetingTitle,
          date: this.state.meetingDate,
          endTime: this.state.meetingEndTime,
          agenda: this.state.initialAgenda,
          attendees: this.state.initialAttendees,
          minutes: this.state.initialMinutes,
          nextSteps: this.state.initialNextSteps,
          decisions: this.state.initialDecisions,
          attachments: this.state.fileLinks,
        }}
        enableReinitialize={true}
        validationSchema={schema}
        ref={node => (this.form = node)}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className='meetingEntryForm'>
            <Form.Row>
              <Form.Group as={Col} md="5">
                <Form.Label>Meeting Title</Form.Label>
                <Form.Control
                  type="text"
                  name="meetingTitle"
                  id="meeting-title"
                  value={values.meetingTitle}
                  onChange={handleChange}
                  isInvalid={!!errors.meetingTitle}
                />
                <Form.Control.Feedback type="invalid">
                  You must at least have a Title.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="2"></Form.Group>
              <Form.Group as={Col} md="5">
                <Form.Row className='pt-0 pb-0'>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Start</Form.Label>
                    <Field name='date'>
                      {({field}) => 
                        <DatePicker
                          id='date-picker'
                          selected={field.value}
                          onChange={field.onChange(field.name)}
                          showTimeSelect
                          timeFormat="h:mm"
                          timeIntervals={30}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className='form-control'
                        />
                      }
                    </Field>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>End</Form.Label>
                    <Field name='endTime'>
                      {({field}) => 
                        <DatePicker
                          id='end-picker'
                          selected={field.value}
                          onChange={field.onChange(field.name)}
                          showTimeSelect
                          timeFormat="h:mm"
                          timeIntervals={30}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className='form-control'
                        />
                      }
                    </Field>
                  </Form.Group>
                </Form.Row>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="5">
                <Form.Label>Agenda</Form.Label>
                <Field name='agenda'>
                  {({field}) => 
                    <ReactQuill 
                      id='meeting-agenda'
                      defaultValue={field.value} 
                      onChange={field.onChange(field.name)}
                      ref={(el) => { this.agendaQuillRef = el }}
                    />
                  }
                </Field>
              </Form.Group>
              <Form.Group as={Col} md="2"></Form.Group>
              <Form.Group as={Col} md="5">
                <Form.Label>Attendees</Form.Label>
                <Field name='attendees' id='attendees'>
                  {({field}) => 
                    <ReactQuill 
                      defaultValue={field.value} 
                      onChange={field.onChange(field.name)}
                      ref={(el) => { this.attendeesQuillRef = el }}
                      id='meeting-attendees'
                    />
                  }
                </Field>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="5">
                <Form.Label>Meeting Minutes</Form.Label>
                <Field name='meetingMinutes' id='meeting-minutes'>
                  {({field}) => 
                    <ReactQuill 
                      defaultValue={field.value} 
                      onChange={field.onChange(field.name)}
                      ref={(el) => { this.minutesQuillRef = el }}
                      id='meeting-minutes'
                    />
                  }
                </Field>
              </Form.Group>
              <Form.Group as={Col} md="2"></Form.Group>
              <Form.Group as={Col} md="5">
                <Form.Label>Next Steps</Form.Label>
                <Field name='nextSteps' id='next-steps'>
                  {({field}) => 
                    <ReactQuill 
                      defaultValue={field.value} 
                      onChange={field.onChange(field.name)}
                      ref={(el) => { this.nextStepsQuillRef = el }}
                      id='meeting-next-steps'
                    />
                  }
                </Field>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="5">
                <Form.Label>Key Decisions</Form.Label>
                <Field name='decisions' id='decisions'>
                  {({field}) => 
                    <ReactQuill 
                      defaultValue={field.value} 
                      onChange={field.onChange(field.name)}
                      ref={(el) => { this.decisionsQuillRef = el }}
                      id='meeting-decisions'
                    />
                  }
                </Field>
              </Form.Group>
              <Form.Group as={Col} md="2"></Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Attachments</Form.Label>
                <Form.Control id='attachment-input' placeholder='URL of Attachment'></Form.Control>
                <div className='em-c-text-passage'>
                  <h4 className='mt-2'>File URLs</h4>
                  <ul className='fileLinkList'>
                    {fileLinks}
                  </ul>
                </div>
              </Form.Group>
              <Form.Group as={Col} md="1">
                <Button 
                  id='meeting-attachment-btn' 
                  variant='outline-primary'
                  onClick={() => {
                    this.addAttachmentLink();
                  }}
                >
                + Add
                </Button>
              </Form.Group>
            </Form.Row>
            <div className="formButtons em-c-btn-group">
              <button className="em-c-btn em-c-btn--secondary" onClick={this.props.handleCancel}>
                <span className="em-c-btn__text">Cancel</span>
              </button>
              <button type="submit" className='em-c-btn em-c-btn--primary' disabled={isSubmitting ? true : false}>
                {
                  isSubmitting ? 
                  <Spinner animation="border" variant="light" size='sm'/>
                  :
                  <span className="em-c-btn__text">Submit</span>
                }
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default MeetingForm;