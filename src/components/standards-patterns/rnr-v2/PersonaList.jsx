import React, { Component } from 'react';
import axios from 'axios';
import GeneralPersona from './GeneralPersona';
import '../../../sass/arch-rnr.scss';

class PersonaList extends Component {
  constructor(props){
    super(props)

    this.state = {
      personaList: [],
    }
  }

  componentDidMount = () => {
    axios({
      headers: {
        'accept': "application/json;odata=verbose",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'GET',
      url: {/* Removed due to contract */}
    })
    .then((response) => {
      //console.log(response.data.d.results);
      const personas = [];

      //parse API results and create persona components for each
      response.data.d.results.forEach((el, index) => {
        personas.push(
          <div key={index} className='col-md-6 col-xl-4 cardBox'>
            <GeneralPersona
              imageUrl={el.Image.Url}
              role={el.Title}
              description={el.Description}
              linkToDetail={`/standards/rnr/persona/${index}`}
            />
          </div>
        )
      })//end of forEach
      this.setState({
        personaList: personas
      })

    }) //end of then
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div id='general-persona-master-container' className='row'>
        {this.state.personaList}
      </div>
    );
  }
}

export default PersonaList;