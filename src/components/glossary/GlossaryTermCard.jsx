import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CardBody, Card, Button } from 'reactstrap';
import { HashLink as Link } from 'react-router-hash-link';

//click handler for inner card flip; need extra event cancels due to overlapping clickable divs
const cardFlip = (e, flipped, setFlipped) => {
  e.cancelBubble = true; //for IE
  if (e.stopPropagation) e.stopPropagation(); //for other browsers

  setFlipped(!flipped);
}

const GlossaryTermCard = props => {
  const [expanded, setExpanded] = useState(false);
  const [flipped, setFlipped] = useState(false);

  //This effect resets the state of flipped to false if the term card is closed while the definition card is flipped
  //Ensures that the definition side is always shown first
  useEffect(() => {
    if (!expanded && flipped) {
      setFlipped(false);
    }
  }, [expanded, flipped])

  return (
    <div className='col-12 col-lg-6 col-xl-3'>
      <div 
        className={`col-12 blockWithShadow pointer ${expanded ? 'openTermCard pb-1' : ''}`}
        onClick={() => setExpanded(!expanded)}
        id={props.data.term}
      >
        <h5 className='mb-0'>{props.data.term}</h5>
        <Collapse isOpen={expanded}>
          {
            props.data.abbr ?
              <h6 className='mt-1'>{`(${props.data.abbr})`}</h6>
            :
            ''
          }
          {
            props.data.explanation ?
              <div className="flip-container">
                <div className={`flipper ${flipped ? 'active' : ''}`}>
                  <div className="front">
                    <div className="flip-inner">
                      <Card className='mt-3' onClick={e => cardFlip(e, flipped, setFlipped)}>
                        <CardBody className='pt-1'>
                          <p className='littleItalic centerText'>Click card to view Explanation</p>
                          <h6>Definition</h6>
                          {props.data.definition}
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                  <div className="back">
                    <div className="flip-inner">
                      <Card className='mt-3' onClick={e => cardFlip(e, flipped, setFlipped)}>
                        <CardBody className='pt-1'>
                          <p className='littleItalic centerText'>Click card to view Definition</p>
                          <h6>Explanation</h6>
                          {props.data.explanation}
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            :
              <Card className='mt-3'>
                <CardBody>
                  <h6>Definition</h6>
                  {props.data.definition}
                </CardBody>
              </Card>
          }
          {
            (props.data.seeAlso.length > 0 || props.data.tags.length > 0) ?
              <Card className='mt-3'>
                <CardBody>
                  { props.data.seeAlso.length > 0 ?
                    <div>
                      <h6>See Also</h6>
                      <div className="d-flex flex-col">
                        {props.data.seeAlso.map(item => (
                          <Link 
                            key={`${props.data.term}->${item}`}
                            to={`/glossary#${item}`}
                            onClick={e => {
                              e.cancelBubble = true; //for IE
                              if (e.stopPropagation) e.stopPropagation(); //for other browsers

                              //get element of id, if it's closed then open it
                              let el = document.getElementById(item);
                              if (!el.classList.contains('openTermCard')) {
                                el.click();
                              }
                            }}
                            scroll={el => {
                              const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
                              const yOffset = -80; 

                              window.scrollTo({
                                  top: yCoordinate + yOffset,
                                  behavior: 'smooth'
                              });
                            }}
                          >
                            <Button color='link'>{item}</Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                    :
                    ''
                  }
                  { props.data.tags.length > 0 ? 
                    <div>
                      <h6>Tags</h6>
                      <div className="d-flex flex-wrap mt-3">
                          {props.data.tags.map(tag => {
                            return props.tagMarkupFunc(tag)
                          })}
                      </div>
                    </div>
                    :
                    ''
                  }
                </CardBody>
              </Card>
            :
              ''
          }

          <p className='whiteText centerText mb-0 mt-3'>
            <a
              href={props.data.source.url}
              target='_blank'
              rel='noopener noreferrer'
              className='whiteText'
              onClick={e => {
                e.cancelBubble = true; //for IE
                if (e.stopPropagation) e.stopPropagation(); //for other browsers
              }}
            >
              {`Source: ${props.data.source.name}`}
            </a>
          </p>
        </Collapse>
      </div>
    </div>
  );
};

GlossaryTermCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default GlossaryTermCard;