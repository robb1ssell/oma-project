import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Modal} from 'react-bootstrap'
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint';
import ReactHtmlParser from 'react-html-parser'
import SignUpSection from './SignUpSection';
import InfoSection from './InfoSection';

const navToPage = url => {
  window.open(url, '_blank')
}

const FaqModal = props => {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='faq-modal'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="faq-modal">
          techconnect FAQ
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='em-c-text-passage'>
        {
          props.data.map(el => (
            <div key={`question-${el.ID}`}>
              <h5 className='mt-2'>{el.Title}</h5>
              {ReactHtmlParser(el.Answer)}
            </div>
          ))
        }
      </Modal.Body>
    </Modal>
  )
}

const TechConnectLanding = () => {
  //const [tagCounter, setTagCounter] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  
  useEffect(() => {
    document.title = 'OMA | techconnect'

    // list id: %7BF2DD5FD4-F812-4789-AA80-B9160AAD33B2%7D
    const getQuestions = async () => {
      let res = await axios.get(
        spListApiUrl('OMA_techconnect_faq'),
        spConfig
      );

      let data = res.data.d.results.filter(el => el.Related_Topic === 'techconnect')
      setQuestionData(data)
    }
    getQuestions()
  }, [])

  return (
    <div className="container-fluid noGutter">
      <SignUpSection/>
      <div className="container">
        <div className="row pt-4 pb-2 mr-0 ml-0">
          <div className="col-12 col-lg-6">
            <div className="em-c-page-header">
              <h1 className="em-c-page-header__title blueText">techconnect</h1>
              <p className="em-c-page-header__desc">
                {/* Removed due to contract */}
              </p>
            </div>
          </div>
          {/* Removed due to contract */}
        </div>
      </div>
      {/*
      <InfoSection/>
      */}
    </div>
  );
};

export default TechConnectLanding;