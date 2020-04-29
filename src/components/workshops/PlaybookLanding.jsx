import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint';
import WorkshopCard from './WorkshopCard';

const PlaybookLanding = props => {
  const [playbooks, setPlaybooks] = useState([]);

  useEffect(() => {
    document.title = 'OMA | Architecture Playbooks'
  }, [])

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        spListApiUrl('OMA_Playbooks'),
        spConfig
      );
      setPlaybooks(res.data.d.results);
    }
    getData();
  }, [])

  return (
    <div className='container-fluid'>
      <div className="row pageHeaderBlueBG">
        <div className="em-c-page-header container whiteText">
          <h1 className="em-c-page-header__title">Architecture Playbooks</h1>
          <p className='em-c-page-header__desc'>
            Listed below are various detailed outlines for workshop facilitation
          </p>
        </div>
      </div>
      <div className="container">
        <div className="row pageSection">
          <div className="col-12">
            <ul className="em-c-picture-card-list em-l-grid em-l-grid--3up">
              {
                playbooks.map(el => {
                  return (
                    <WorkshopCard
                      title={el.Title}
                      desc={el.Desc}
                      external={el.External_Link}
                      link={el.Link.Url}
                      image={el.Image.Url}
                    />
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookLanding;