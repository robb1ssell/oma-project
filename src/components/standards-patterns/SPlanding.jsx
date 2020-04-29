import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios';
//import IconBox from '../IconBox';

class SPlanding extends Component {
  componentDidMount = () => {
    document.title = 'OMA | Standards & Patterns'
  }

  render() {
    return (
      <div id="standards" className='container subPage'>
        <div className="em-c-page-header">
          <h1 className="em-c-page-header__title">Standards & Patterns</h1>
          <p className='em-c-page-header__desc'>
            We will provide clear guidance and paved paths to our architects 
            to enable quick decision making and faster onboarding.
          </p>
        </div>
        <div className='row pageSection'>
          <div className='col-12 col-md-4 iconbox pb-5'>
            <Link to='/standards/rnr'>
              <div className='iconbox-img'>
                <img 
                  src='https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/rnr-new-icon.jpg' 
                  alt="Tool Visual"
                />
              </div>
              <div className="boxBody centerText">
                <h4>Roles & Responsibilities</h4>
                <p>
                  Understand your other architects role with regards to what responsibilities, 
                  boundaries, decision rights, interactions, and the various types of work 
                  products that they produce.
                </p>
              </div>
            </Link>
          </div>
          <div className='col-12 col-md-4 iconbox pb-5'>
            <Link to='/standards/mvap'>
              <div className='iconbox-img'>
                <img 
                  src='https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/mvap-new-icon.jpg' 
                  alt="Tool Visual"
                  />
              </div>
              <div className="boxBody centerText">
                <h4>Architecture Patterns</h4>
                <p>
                  Discover how to apply architecture methods and patterns in order to 
                  expedite the creation of a “Just enough architecture” that is good 
                  enough for the product to be released.  Learn how to continually 
                  improve it over the lifetime of the product.
                </p>
              </div>
            </Link>
          </div>
          <div className='col-12 col-md-4 iconbox pb-5'>
            <Link to='/standards/keyconcepts'>
              <div className='iconbox-img'>
                <img 
                  src='https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/key-concepts-icon.jpg' 
                  alt="Tool Visual"
                  />
              </div>
              <div className="boxBody centerText">
                <h4>Key Concepts</h4>
                <p>
                  Review and better understand the key concepts of Enterprise Architecture.
                </p>
              </div>
            </Link>
          </div>
          <div className='col-12 col-md-4 iconbox pb-5'>
            <Link to='/glossary'>
              <div className='iconbox-img'>
                <img 
                  src='https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/glossary-logo.jpg' 
                  alt="Tool Visual"
                  />
              </div>
              <div className="boxBody centerText">
                <h4>IT Architecture Glossary</h4>
                <p>
                  In the glossary, you will find the architecture term you are looking for and
                  the agreed upon definition according to industry standards. Explanations, related terms,
                  and sources are all provided.
                </p>
              </div>
            </Link>
          </div>
          <div className='col-12 col-md-4 iconbox pb-5'>
            <a href='http://goto/eacouncil'>
              <div className='iconbox-img'>
                <img 
                  src='https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/ea-council-icon.jpg' 
                  alt="Tool Visual"
                  />
              </div>
              <div className="boxBody centerText">
                <h4>EA Council</h4>
                <p>
                  Holds the decision rights concerning architectural guidance of 
                  EM-wide scale and serves as a decision making body for architectural governance
                </p>
              </div>
            </a>
          </div>
          <div className='col-12 col-md-4 iconbox pb-5'>
            <a href='http://goto/eaprinciples' target='_blank' rel='noreferrer noopener'>
              <div className='iconbox-img'>
                <img 
                  src='https://ishareteam2.na.xom.com/sites/at/ea/OMA/images/mandates-new-icon.jpg' 
                  alt="Tool Visual"
                  />
              </div>
              <div className="boxBody centerText">
                <h4>EA Principles & Mandates</h4>
                <p>
                  Explore the key architectural principles, mandates, and guard 
                  rails designed to practice effective architecture based upon 
                  industry standards and best practices.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SPlanding;

/*
componentDidMount = () => {
  axios({
    headers: {
      'accept': "application/json;odata=verbose",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    method: 'GET',
    url: "https://ishareteam2.na.xom.com/sites/at/ea/_api/web/lists/GetByTitle('OMA_StandardsPatternsTiles')/items"
  })
  .then((response) => {
    let tileInfo = response.data.d.results;
    //console.log(response.data.d.results);
    const tilesTemp = [];

    tileInfo.forEach(el => {
      tilesTemp.push(
        <IconBox
          key={el.ID}
          title={el.Title}
          path={el.Path}
          desc={el.Description}
          icon={el.Image.Url}
          imgContainerClassList={}
          containerClassList={}
        />
        
        <PictureTileListItem
          key={el.ID}
          title={el.Title}
          path={el.Path}
          desc={el.Description}
          image={el.Image.Url}
          kicker={el.Kicker}
        />
        );
      });
      this.setState({
        tiles: tilesTemp
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
*/