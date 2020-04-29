import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint'
import CourseSignUp from '../CourseSignUp';
import moment from 'moment'
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'; //needed for bootbox
import * as bootbox from 'bootbox';
import TrainingIntro from './TrainingIntro';
import WhyTrain from './WhyTrain';
import TrainingCourseSection from './TrainingCourseSection';

const TrainingV2 = () => {
  const [courses, setCourses] = useState();

  useEffect(() => {
    document.title = 'OMA | Training'
  }, [])

  // get course data from currently offered trainings
  useEffect(() => {
    axios.get(
      spListApiUrl('OMA_TrainingOfferings'),
      spConfig
    )
    .then(resp => {
      setCourses(resp.data.d.results);
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div id="training" className="container-fluid noGutter">
      <div className="container subPage">
        <TrainingIntro/>
        <WhyTrain/>
        <TrainingCourseSection
          data={courses}
        />
      </div>
    </div>
  );
};

export default TrainingV2;