import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser'

class CourseDetail extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      courseName: props.match.params.name,
      courseData: {},
    }
  }

  componentDidMount = () => {
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
      response.data.d.results.forEach(el => {
        if (el.Title === this.state.courseName) {
          this.setState({
            courseData: el
          })
        }
      })
    }) //end of then
    .catch((error) => {
      console.log(error);
    });
  }

  navToTrainingHome = () => {
    this.props.history.push('/training')
  }

  openExternalLink = (type) => {
    if (type === 'brochure') {
      window.open(this.state.courseData.Brochure.Url, '_blank');
    }

    if (type === 'materials') {
      window.open(this.state.courseData.Material.Url, '_blank');
    }

    if (type === 'course') {
      window.open(this.state.courseData.CourseLink.Url, '_blank');
    }
  }

  render() {
    return (
      <div className='container'>
        <div className="row">
          <div className="col-sm-12 col-lg-7 em-c-text-passage indentLists">
            <h2>{this.state.courseData.Title}</h2>
            <p>Hosted {this.state.courseData.Hosted}</p>
            <h4>Description</h4>
            {ReactHtmlParser(this.state.courseData.ShortDescription)}
            <h4>Agenda</h4>
            {ReactHtmlParser(this.state.courseData.Agenda)}
          </div>
          <div className="col-sm-12 col-lg-5 courseTableContainer">
            <table className='courseTable'>
              <tbody>
                <tr>
                  <td className='bold'>Time</td>
                  <td>{this.state.courseData.Total_Time}</td>
                </tr>
                <tr>
                  <td className='bold'>Cost</td>
                  <td>{this.state.courseData.Cost ? 'Yes' : 'None'}</td>
                </tr>
                <tr>
                  <td className='bold'>Pre-Requisites</td>
                  <td>{this.state.courseData.Prerequisites}</td>
                </tr>
                <tr>
                  <td className='bold'>Career Connect Skills</td>
                  <td>{this.state.courseData.CareerConnectSkills}</td>
                </tr>
              </tbody>
            </table>
            <div className="row">
              <div id='courseOptionsContainer' className="col-sm-12 pt-5 em-c-text-passage">
                <h4>Registration Instructions</h4>
                {ReactHtmlParser(this.state.courseData.RegistrationInstructions)}
                <div className="d-flex justify-se em-c-btn-group pt-4 mt-5">
                  <button className="em-c-btn" onClick={() => this.openExternalLink('brochure')}>
                    <div className="em-c-btn__inner">
                      {/* Removed due to contract */}
                      <span className="em-c-btn__text">Course Brochure</span>
                    </div>
                  </button>
                  <button className="em-c-btn" onClick={() => this.openExternalLink('materials')}>
                    <div className="em-c-btn__inner">
                      {/* Removed due to contract */}
                      <span className="em-c-btn__text">Course Materials</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="btn-center-bottom mb-5">
          <button className="em-c-btn" onClick={this.navToTrainingHome}>
            <div className="em-c-btn__inner">
              {/* Removed due to contract */}
              <span className="em-c-btn__text">Back to Courses</span>
            </div>
          </button>
        </div>
      </div>
    );
  }
}

export default CourseDetail;