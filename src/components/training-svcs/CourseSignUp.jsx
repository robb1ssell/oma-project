import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { Col, Form, Button, ButtonToolbar } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';


ReactModal.setAppElement('#root'); //set for screenreaders to pass it by when modal closed

const schema = yup.object({
  location: yup.string().required(),
  arch101: yup.bool(),
  busArch: yup.bool(),
  wwa: yup.bool(),
})
.test(
  'courseTest',
  null,
  (obj) => {
    if (obj.arch101 || obj.busArch || obj.wwa) {
      return true;
    }

    return new yup.ValidationError(
      'Please choose at least 1 course.',
      null,
      'courseSelect'
    )
  }
)
;


class CourseSignUp extends Component {
  render() {
    return (
      <div>
        <button className="em-c-btn  mb-0" onClick={this.props.openModal}>
          <span className="em-c-btn__text">Interested in Training? Let us know.</span>
        </button>
        <ReactModal 
          isOpen={this.props.modalOpen}
          contentLabel="Future Course Interest"
          shouldCloseOnOverlayClick={true}
          onRequestClose={this.props.closeModal}
          className="signupModalBody"
          overlayClassName="signupOverlay"
        >
          <div className="em-c-text-passage">
            <h4 className='mb-4 mt-0'>Training Interest Form</h4>
            <p>
              If you did not see any available trainings in our Scheduled Training section,
              please fill out this form to be added to our list of interested people. If enough
              interest is generated in your location, this list will be the source of who will be
              chosen to participate on a first come, first serve basis. If you are selected to attend,
              we will notify you via email with the details. 
            </p>
            <p>
              For questions/special requests, such as adding other people or groups, please
              <a 
                href={/* Removed due to contract */}
                style={{textDecoration: 'none'}}
              > click here to email Heidi Larsen.
              </a>
            </p>
          </div>
          <Formik
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              this.props.addUser(values);
            }}
            initialValues={{
              name: this.props.user.account.name,
              arch101: false,
              busArch: false,
              wwa: false,
            }}
            validationSchema={schema}
            ref={node => this.form = node}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              touched,
            }) => (
              <Form noValidate onSubmit={handleSubmit} className='' id='course-waitlist-signup'>
                <Form.Row className='pb-4'>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row className='pb-4'>
                  <Form.Group as={Col} md="4">
                    <Form.Check 
                      type="checkbox" 
                      label="Architecture 101 - 2 Day" 
                      name='arch101' 
                      value={values.arch101}
                      onChange={handleChange}
                      isInvalid={errors.courseSelect}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Check 
                      type="checkbox" 
                      label="Business Architecture" 
                      name='busArch' 
                      value={values.busArch}
                      onChange={handleChange}
                      isInvalid={errors.courseSelect}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Check 
                      type="checkbox" 
                      label="Working With Architects" 
                      name='wwa' 
                      value={values.wwa}
                      onChange={handleChange}
                      isInvalid={errors.courseSelect}
                    />
                  </Form.Group>
                  <Form.Control.Feedback>
                    {errors.courseSelect}
                  </Form.Control.Feedback>
                </Form.Row>
                <Form.Row className='pb-4'>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Preferred Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      id="location"
                      value={values.location}
                      onChange={handleChange}
                      isValid={touched.location && !errors.location}
                      isInvalid={!!errors.location}
                    />
                    <Form.Control.Feedback type='valid'>Ok!</Form.Control.Feedback>
                    <Form.Control.Feedback type='invalid'>
                      Please provide your preferred training location.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                <ButtonToolbar className='d-flex justify-se'>
                  <Button variant='danger' onClick={this.props.closeModal}>Cancel</Button>
                  <Button variant="primary" type="submit">Submit</Button>
                </ButtonToolbar>
              </Form>
            )}
          </Formik>
        </ReactModal>
      </div>
    );
  }
}

export default CourseSignUp;