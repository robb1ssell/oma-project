import React from 'react';

const TitleSection = props => {
  return (
    <div className="row pageSection">
      <div className="em-c-page-header col-12 centerText">
        <h1 className="em-c-page-header__title blueText">{props.data.Title}</h1>
        <p className="em-c-page-header__desc mr-auto ml-auto">{props.data.Purpose}</p>
      </div>
    </div>
  );
};

export default TitleSection;