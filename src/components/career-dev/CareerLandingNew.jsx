import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {spListApiUrl, spConfig, spListById} from 'utils/sharepoint';
import ACMIntroSection from './ACMIntroSection';
import WhatsInIt from './WhatsInIt';
import DesignationSection from './DesignationSection';
import CertificationSection from './CertificationSection';
import MeetCouncilSection from './MeetCouncilSection';
import NewSkillsSection from './NewSkillsSection';
import RequirementsTable from './RequirementsTable';
import CouncilProcessSection from './CouncilProcessSection';
import ReadyToApply from './ReadyToApply';
//import CareerFAQ from './CareerFAQ';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Modal} from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'

const FaqModal = props => {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='career-faq-modal'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="career-faq-modal">
          Career FAQ
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='em-c-text-passage'>
        {
          props.data ?
          props.data.map(el => (
            <div key={`question-${el.ID}`}>
              <h5 className='mt-2'>{el.Title}</h5>
              {ReactHtmlParser(el.Answer)}
            </div>
          ))
          :
          ''
        }
      </Modal.Body>
    </Modal>
  )
}

const CareerLandingNew = () => {
  const [councilData, setCouncilData] = useState();
  const [skillData, setSkillData] = useState();
  const [skillTypeShown, setSkillTypeShown] = useState('Functional');
  const [modalShow, setModalShow] = useState(false);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    document.title = 'OMA | EMIT ACM'
  }, [])

  useEffect(() => {
    let temp = [];
    const getData = async () => {
      let list = spListApiUrl('OMA_ACM_Council_Members');
      let listWithOdata = `${list}?$select=*,Member/Title,Member/UserName,Member/Name&$expand=Member`
      const resp = await axios.get(
        listWithOdata,
        spConfig
      );

      resp.data.d.results.forEach(el => {
        let region = el.Member.Name.slice(7,9);
        let name = el.Member.Title.split(' ');
        let fname = name[1];
        let lname = name[0].substring(0, name[0].lastIndexOf(','));
        let img;
        if (el.Alt_Pic) {
          img = el.Alt_Pic.Url
        }
        else {
          img = `http://lyncpictures/service/api/image/${region}_${el.Member.UserName}`
        }

        temp.push({
          name: `${fname} ${lname}`,
          desc: el.Desc,
          picture: img,
        })
      })
      setCouncilData(temp)
    }
    getData()
  }, [])
  
  useEffect(() => {
    const getData = async () => {
      const resp = await axios.get(
        spListApiUrl('OMA_ACM_Skills'),
        spConfig
      );
      const sorted = resp.data.d.results.sort((a, b) => ('' + a.Title).localeCompare(b.Title))
      setSkillData(sorted)
    }
    getData()
  }, [])
  
  useEffect(() => {
    // list id: %7BF2DD5FD4-F812-4789-AA80-B9160AAD33B2%7D
    const getFAQ = async () => {
      let res = await axios.get(
        spListById('%7BF2DD5FD4-F812-4789-AA80-B9160AAD33B2%7D'),
        spConfig
      );

      let data = res.data.d.results.filter(el => el.Related_Topic === 'career')
      setFaqData(data)
    }
    getFAQ()
  }, [])

  return (
    <div className='container subPage'>
      <div className="row">
        <div className="col-12">
          <div className="em-c-page-header">
            <h1 className="em-c-page-header__title blueText">{/* Removed due to contract */}</h1>
            <p className="em-c-page-header__desc">
              {/* Removed due to contract */}
            </p>
          </div>
        </div>
      </div>
      <ACMIntroSection/>
      <WhatsInIt/>
      <DesignationSection/>
      <CertificationSection/>
      {
        skillData ? 
        <NewSkillsSection 
          data={skillData}
          skillTypeShown={skillTypeShown}
          setSkillTypeShown={setSkillTypeShown}
        />
        :
        ''
      }
      <RequirementsTable/>
      <CouncilProcessSection/>
      {
        councilData ?
        <MeetCouncilSection data={councilData}/>
        :
        ''
      }
      <ReadyToApply/>
      {
        faqData ? 
        <div className='d-flex justify-content-center mt-5 mb-5'>
          <div className="d-flex flex-row techConnectLink pointer"
            onClick={() => setModalShow(true)}
          >
            <FontAwesomeIcon icon={['far', 'question-circle']} color='#0C479D' fixedWidth />
            <span className='d-flex align-items-center pl-4 blueText'>Career FAQ</span>
          </div>
          <FaqModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            data={faqData}
          />
        </div>
        :
        ''
      }
    </div>
  );
};

export default CareerLandingNew;