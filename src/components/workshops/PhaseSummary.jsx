import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ComplexitySection from './ComplexitySection';
import SetupSection from './SetupSection';
import FacilitateSection from './FacilitateSection';
import TakeawaySection from './TakeawaySection';
//import * as jsPDF from 'jspdf'
//import html2canvas from 'html2canvas';

const PhaseSummary = props => {
  const params = props.match.params;
  const [data, setData] = useState([]); //current display data

  //Set document title dynamically as page changes
  useEffect(() => {
      document.title = `${params.name} | ${params.phase} | Summary`
  }, [params.phase, params.name])

  //pull data from sharepoint and fill our current set with items that match the current workshop
  useEffect(() => {
    let temp = [];
    let list = spListApiUrl('OMA_Workshop_Facilitation_Template');
    let listWithOdata = `${list}?$select=*,Workshop/Title&$expand=Workshop/Id`
    axios.get(
      listWithOdata,
      spConfig
    )
    .then(resp => {
      resp.data.d.results.forEach(el => {
        if (el.Workshop.Title === params.phase) {
          temp.push(el);
        }
      })
      setData(temp);
    })
  }, [params.phase])

  return (
    <div className="container workshopTemplate">
      <div className="row">
        <div className="col-12 d-flex">
          <Link to={`/workshops`}>
            <button 
              className='em-c-btn em-c-btn--bare mt-3'
            >
              <div className="em-c-btn__inner">
                <FontAwesomeIcon icon={['fas', 'arrow-left']}/>
                <span className="em-c-btn__text ml-2">Workshops Home</span>
              </div>
            </button>
          </Link>
      {/**
          <button 
            onClick={() => createPdf(params.phase)}
            className='em-c-btn em-c-btn--primary mb-3 mt-3'
          >
            <div className="em-c-btn__inner">
              <FontAwesomeIcon icon={['fas', 'download']} color='#FFFFFF'/>
              <span className="em-c-btn__text ml-2">Download PDF</span>
            </div>
          </button>
        */}
        </div>
      </div>
      <div id="html-to-pdf">
        <div className="row mt-5">
          <div className="em-c-page-header col-12 centerText">
            <h1 className="em-c-page-header__title blueText">{params.phase}</h1>
            <p className="em-c-page-header__desc mr-auto ml-auto">Summary</p>
          </div>
        </div>
        {
          data.map(el => (
            <div key={el.Title} className="row pageSection">
              <div className="col-12 workshopSectionHeader">
                <div className="d-flex justify-content-center">
                  <Link to={`/workshops/${params.name}/${params.phase}/${el.OrderID}`}>
                    <h2>{el.Title}</h2>
                  </Link>
                </div>
              </div>
              <div className="col-12 d-flex flex-column centerText mt-3">
                <h4>{el.Purpose}</h4>
              </div>
              {/** Setup Section */}
              <div className="col-12">
                <SetupSection data={el}/>
              </div>
              {/* Facilitate Section */}
              <div className="col-12 pageSection">
                <FacilitateSection data={el}/>
              </div>
              {/* Complexity */}
              <div className="col-12">
                <ComplexitySection data={el}/>
              </div>
              {/* Takeaways */}
              <div className="col-12 pageSection">
                <TakeawaySection data={el}/>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default PhaseSummary;
