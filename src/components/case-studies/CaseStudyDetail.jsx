import React, { useState, useEffect } from 'react';
import { sp } from "@pnp/sp";
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import CSArtifactCard from './CSArtifactCard';

sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl: process.env.REACT_APP_SP_BASEURL
  },
});

/**
 * 
 const linkCheck = (link) => {
   if (link.substr(0, 4) !== 'http') {
     return `http://${link}`;
   }
   return link;
 }
 */

const CaseStudyDetail = (props) => {
  const [study, setStudy] = useState({});
  const [artifacts, setArtifacts] = useState([]);
  const id = props.match.params.id;
  
  useEffect(() => {
    const getInfo = async () => {
      const result = await sp.web.lists.getByTitle('OMA_Case_Studies').items
      .getById(id)
      .get()
      
      setStudy(result)
    };
    getInfo();
  }, [id])

  useEffect(() => {
    const getArtifacts = async () => {
      const result = await sp.web.lists.getByTitle('OMA_Case_Study_Artifacts').items
      .filter("Case_Study/ID eq'"+ id + "'")
      .get()

      setArtifacts(result)
    };
    getArtifacts();
  }, [id])

  return (
    <div className="container-fluid subPage caseStudy">
      <div className="row em-c-text-passage">
        <div className="col-12">
          <h4 className='mt-2'>{moment(study.Date).format('MMMM YYYY')}</h4>
          <h2 className='mt-2'>{study.Title}</h2>
        </div>
      </div>
      <div className="row em-c-text-passage">
        <div className="col-12 col-xl-9">
          <div>
            <h4 className="mt-2">Objective</h4>
            {ReactHtmlParser(study.Objective)}
          </div>
          <div>
            <h4 className="mt-2">Value Delivered</h4>
            {ReactHtmlParser(study.ValueDelivered)}
          </div>
        </div>
        <div className="col-12 col-xl-3">
          <div className='caseTeamList'>
            <h4 className="mt-2">Working Team</h4>
            {ReactHtmlParser(study.WorkingTeam)}
          </div>
        </div>
      </div>
      {
        artifacts.length > 0 ?
          <div className='row em-c-text-passage'>
            <div className="col-12">
              <h4 className='mt-4'>{study.PatternUsed} Reference Implementation Artifacts</h4>
            </div>
            <div className="col-12">
              <div className="row">
                {
                  artifacts.map((art, i) => (
                    <CSArtifactCard
                      key={`cs-artifact-${i}`}
                      name={art.Artifact}
                      layer={art.ArchLayer}
                      outcome={art.Business_Outcome}
                      thumbnail={art.Thumbnail ? art.Thumbnail.Url : ''}
                      links={art.ArtifactLink ? art.ArtifactLink : ''}
                    />
                  ))
                }
              </div>
            </div>
            <div className="col-12 centerText mt-5">
              You can find more information about these artifacts on our <Link to='/archsupport/templates'>Templates page</Link>
            </div>
          </div>
        :
        ''
      }
    </div>
  );
};

export default CaseStudyDetail;