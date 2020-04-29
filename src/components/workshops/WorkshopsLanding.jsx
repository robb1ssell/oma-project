import React, {useState, useEffect} from 'react';
import sp from 'utils/sharepoint'
import {Link} from 'react-router-dom'

const WorkshopsLanding = props => {
  const [workshopData, setWorkshopData] = useState([]);
  const [phaseData, setPhaseData] = useState([]);
  
  useEffect(() => {
    document.title = 'Workshop Facilitation';

    sp.web.lists.getByTitle('OMA_Phase_Parents').items.get()
    .then(items => {
      setWorkshopData(items)
    })
  }, [])

  useEffect(() => {
    const getPhaseData = async () => {
      const data = await sp.web.lists.getByTitle('OMA_Phase_List').items.get();
      const sorted = data.sort((a, b) => a.OrderID - b.OrderID)
      setPhaseData(sorted)
    }
    getPhaseData()
  }, [])

  return (
    <div className='container-fluid'>
      <div className="row pageHeaderBlueBG">
        <div className="em-c-page-header container whiteText">
          <h1 className="em-c-page-header__title">Workshop Facilitation</h1>
          <p className='em-c-page-header__desc'>
            Listed below are various detailed outlines for workshop facilitation
          </p>
        </div>
      </div>
      <div className="container">
        <div className="row pageSection">
          {
            workshopData.map(wkshop => (
              <div key={wkshop.Title} id={wkshop.Title} className="col-12 col-lg-6 em-c-text-passage">
                <div className="workshopSectionHeader">
                  <div className="d-flex justify-content-center">
                    <h2>{wkshop.Title}</h2>
                  </div>
                </div>
                {
                  phaseData.map(phase => (
                    <div key={phase.Title} className='d-flex mb-3 justify-se align-items-center flex-column flex-lg-row'>
                      <div className="d-flex flex-column justify-content-center wkshopLandingPhase">
                        <div className="centerText">
                          <Link to={`/workshops/${wkshop.Title}/${phase.Title}/1`}>
                            <h3 className='mt-0 mb-2'>{phase.Title}</h3>
                          </Link>
                        </div>
                        <div className="centerText">
                          <Link to={`/workshops/${wkshop.Title}/${phase.Title}`}>
                            (Summary)
                          </Link>
                        </div>
                      </div>

                      <div>
                        <p className='mb-0'>{phase.Description}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default WorkshopsLanding;