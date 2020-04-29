import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint';
import WorkshopCard from './WorkshopCard';

const PhaseLanding = props => {
  const params = props.match.params;
  const [phaseData, setPhaseData] = useState([]);
  
  useEffect(() => {
    document.title = `${params.name}`;

    // list id: %7B08A36E0F-7A74-49C6-A1B3-96F9681D488B%7D
    axios.get(
      spListApiUrl('OMA_Workshop_IDs'),
      spConfig
    )
    .then(resp => {
      setPhaseData(resp.data.d.results)
    })
  }, [params.name])

  return (
    <div className='container-fluid'>
      <div className="row pageHeaderBlueBG">
        <div className="em-c-page-header container whiteText">
          <h1 className="em-c-page-header__title">{params.name}</h1>
          {/**
          <p className='em-c-page-header__desc'>
            Listed below are various detailed outlines for workshop facilitation
          </p>
           */}
        </div>
      </div>
      <div className="container">
        <div className="row pageSection">
          <div className="col-12">
            <ul className="em-c-picture-card-list em-l-grid em-l-grid--3up">
              {
                phaseData.map(item => (
                  <WorkshopCard
                    key={item.Title}
                    id={item.ID}
                    title={item.Title}
                    desc={item.Description}
                    image={item.Image ? item.Image.Url : ''}
                    kicker={item.Kicker}
                    pathToPage={`/workshops/${params.name}/${item.Title}/1`}
                  />
                ))
              }
            </ul>
          </div>
        </div>
        <div className="row">
          <img src={/* Removed due to contract */} alt="" useMap="#image-map"/>

          <map name="image-map">
              <area target="_blank" alt="" title="" href={/* Removed due to contract */} coords="209,158,398,220,370,280,312,346,256,384,189,405,134,410,133,306,135,216,171,207,197,186" shape="poly"/>
          </map>
        </div>
      </div>
    </div>
  );
};

export default PhaseLanding;