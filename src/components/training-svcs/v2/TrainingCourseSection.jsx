import React from 'react';
import CourseCard from './CourseCard'

const TrainingCourseSection = props => {
  let data = [
    {Title: 'Title', ShortDescription: "This is the description", TrainingType: "Instructor-Led", Kicker: 'Kicker Text'},
    {Title: 'Title', ShortDescription: "This is the description", TrainingType: "Online", Kicker: 'Kicker Text'},
    {Title: 'Title', ShortDescription: "This is the description", TrainingType: "Self-Study", Kicker: 'Kicker Text'},
    {Title: 'Title', ShortDescription: "This is the description", TrainingType: "Instructor-Led", Kicker: 'Kicker Text'},
    {Title: 'Title', ShortDescription: "This is the description", TrainingType: "Online", Kicker: 'Kicker Text'},
    {Title: 'Title', ShortDescription: "This is the description", TrainingType: "Self-Study", Kicker: 'Kicker Text'},
  ]
  return (
    <div className='row pageSection'>
      <div className="col-12">
        <h2 className='sectionHeader mb-4'>Courses</h2>
      </div>
      {
        data ?
          data.map(el => (
            <div className='col-12 col-md-6 col-lg-4 col-xl-3'>
              <div className="mb-3">
                <CourseCard
                  title={el.Title ? el.Title : 'Title'}
                  desc={el.ShortDescription ? el.ShortDescription : 'Description of the course will go here'}
                  pathToDetails={`/training/course/${el.Title}`}
                  type={el.TrainingType}
                  kicker={el.Kicker}
                />
              </div>
            </div>
          ))
          :
          ''
      }
    </div>
  );
};

export default TrainingCourseSection;