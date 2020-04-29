import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Modal} from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'

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

const CareerFAQ = props => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className='mt-5 mr-auto ml-auto'>
      <div className="d-flex flex-row techConnectLink pointer"
        onClick={() => setModalShow(true)}
      >
        <FontAwesomeIcon icon={['far', 'question-circle']} color='#0C479D' fixedWidth />
        <span className='d-flex align-items-center pl-4 blueText'>Career FAQ</span>
        <FaqModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          data={props.questionData}
        />
      </div>
    </div>
  );
};

export default CareerFAQ;