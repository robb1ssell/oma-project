import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap'

const ModalWrapper = props => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="legend-modal-for-thumbs"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="legend-modal-for-thumbs">
          Architecture Levels & Domains
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row layerImages">
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <img src={/* Removed due to contract */} alt="Arch Layers"/>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <img src={/* Removed due to contract */} alt="Arch Domains"/>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const LegendModal = () => {
  const [modalShow, setModalShow] = useState(false)
  return (
    <div>
      <Button variant='link' onClick={() => setModalShow(true)}>
        Show Layer/Domain Legend
      </Button>

      <ModalWrapper 
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default LegendModal;