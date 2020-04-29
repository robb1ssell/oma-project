import React, {useState, useEffect} from 'react';
import { sp } from "@pnp/sp";
import moment from 'moment'
import CaseStudyCard from './CaseStudyCard';

sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl: process.env.REACT_APP_SP_BASEURL
  },
});

const CaseStudyLanding = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    document.title = 'OMA | Architecture Showcase'
  }, [])

  useEffect(() => {
    const getCases = async () => {
      const caseData = await sp.web.lists.getByTitle('OMA_Case_Studies').items.get();
      setCases(caseData);
    }
    getCases();
  }, [])

  return (
    <div className='container-fluid'>
      <div className="row pageHeaderBlueBG">
        <div className="em-c-page-header container whiteText">
          <h1 className="em-c-page-header__title">Architecture Showcase</h1>
          <p className='em-c-page-header__desc'>
            {/* Removed due to contract */}
          </p>
        </div>
      </div>
      <div className="container">
        <div className="row pageSection">
          <div className="col-12">
            <ul className="em-c-picture-card-list em-l-grid em-l-grid--3up">
              {
                cases.map(el => {
                  return (
                    <CaseStudyCard
                      key={el.ID}
                      title={el.Title}
                      summary={el.Summary}
                      date={moment(el.Date).format("MMM 'YY")}
                      pathToDetail={`/archsupport/archshowcase/detail/${el.ID}`}
                      image={el.Banner}
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

export default CaseStudyLanding;