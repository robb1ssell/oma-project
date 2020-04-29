import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import BDATbuttons from './BDATbuttons';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faStroopwafel);

class PersonaDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      personaID: props.match.params.id,
      personaDetails: {Image: ''}, //does not work without Image initally set to null
      bdatVisible: false,
      bdatOverviewVisible: false,
      bdatDisabledList: [],
      bdatOverviewPath: '',
      bdatBusinessPath: '',
      bdatDataPath: '',
      bdatAppsPath: '',
      bdatTechPath: '',
      artifacts: [],
    }

    this.fetchData = this.fetchData.bind(this);
    this.listArtifacts = this.listArtifacts.bind(this);
  }

  fetchData = () => {
    axios({
      headers: {
        'accept': "application/json;odata=verbose",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      method: 'GET',
      //Each Artifact column has to be selected and expanded within the url query to be accessed
      //If additional columns are added to the SharePoint ArtifactMasterList, they must be supported here
      //https://ishareteam2.na.xom.com/sites/at/ea/_layouts/15/start.aspx#/Lists/OMA_ArtifactMasterList/AllItems.aspx
      url: {/* Removed due to contract */}
    })
    .then((response) => {
      const results = response.data.d.results;

      results.forEach(el => {
        // Used == instead of === because comparing number to string
        // eslint-disable-next-line
        if (el.GivenID == this.state.personaID) {//GivenID is static in sharepoint - matches persona cards for correct details
          //set state with active info
          this.setState({
            personaDetails: el
          })
        }
      })//end forEach
      
      //Configure BDAT buttons for Enterprise, IDs correspond to sharepoint list GivenID
      if (this.state.personaID === '1' ||
          this.state.personaID === '11' ||
          this.state.personaID === '12' ||
          this.state.personaID === '14' ||
          this.state.personaID === '13'
      ){
        this.setState({
          bdatVisible: true,
          bdatOverviewVisible: true,
          bdatDisabledList: [false, false, true, false], //in order of buttons on UI
          bdatOverviewPath: '/standards/rnr/persona/1',
          bdatBusinessPath: '/standards/rnr/persona/12',
          bdatDataPath: '/standards/rnr/persona/11',
          bdatAppsPath: '#', //'/standards/rnr/persona/14' **Uncomment if Ent App gets content
          bdatTechPath: '/standards/rnr/persona/13',
        });
      }
      //Configure BDAT buttons for Capability, IDs correspond to sharepoint list GivenID
      if (this.state.personaID === '2' ||
          this.state.personaID === '7' ||
          this.state.personaID === '8' ||
          this.state.personaID === '9' ||
          this.state.personaID === '10'
      ){
        this.setState({
          bdatVisible: true,
          bdatOverviewVisible: true,
          bdatDisabledList: [false, false, false, false], //in order of buttons on UI
          bdatOverviewPath: '/standards/rnr/persona/2',
          bdatBusinessPath: '/standards/rnr/persona/7',
          bdatDataPath: '/standards/rnr/persona/8',
          bdatAppsPath: '/standards/rnr/persona/9',
          bdatTechPath: '/standards/rnr/persona/10',
        });
      }

      this.removeActiveButtonStyle(); //clear all active styles so only new one is applied
      this.setActiveButton(); //apply active style to correct button
      this.addListStyle(); //add styles after state is set and component is mounted
      this.listArtifacts(results); //populate list of resources for UI
    }) //end of then
    .catch((error) => {
      console.log(error);
    });
  }

  //Initial data load when component mounts
  componentDidMount = () => {
    this.fetchData();
  }

  //When BDAT button is pressed, get new match id from URL and fetch corresponding data
  componentWillReceiveProps = (newProps) => {
    this.setState({
      personaID: newProps.match.params.id
    }, () => {
      this.fetchData();
    })
  }

  /*  Accepts 1 argument, results, which is the data returned from API in fetchData()
      **Axios call must be updated for additional Artifact capacity!!**

      - Creates list items for each artifact that exists, ignores blank results.
      - Only creates <li> for unique Artifacts
      - Tracks duplicate items in separate array to be used later
      - Makes call to createInlineReferences passing data created

  */
  listArtifacts = (results) => {
    const filteredRefItems = [];
    let filteredRefUrls = [];
    let dupRefUrls = [];

    results.forEach((el) => {
      // Used == instead of === because comparing number to string
      // eslint-disable-next-line
      if (this.state.personaID == el.GivenID) { //only use active object
        let pos = 1; //track position for duplicates
        Object.keys(el).forEach(key => {
          //We only want keys that follow the pattern 'Artifact_' with either 1 or 2 digits following
          if (key.match(/(^.{9}[0-9]$)|(^.{10}[0-9]$)/)) {
            //if __deferred, the sharepoint entry is empty, so we ignore. Otherwise, create <li>
            if(!el[key].hasOwnProperty('__deferred')) {
              //check if the Url of the Artifact is unique to the list
              //if not already used, add to tracker list and create <li>
              if (filteredRefUrls.indexOf(el[key].ArtifactLink) === -1) {
                filteredRefUrls.push(el[key].ArtifactLink);
                filteredRefItems.push(
                  <li key={key} className='col-sm-12 col-xl-6'>
                    <a 
                      href={el[key].ArtifactLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {el[key].Title}
                    </a>
                  </li>
                )
                pos += 1;
                //found a duplicate, add which reference number it is, the link position, and url
              } else {
                dupRefUrls.push(
                  {
                    refNum: filteredRefUrls.indexOf(el[key].ArtifactLink) + 1,
                    position: pos, 
                    url: el[key].ArtifactLink
                  }
                )
                pos += 1;
              }
            }
          }
        })
        this.createInlineReferences(filteredRefItems, dupRefUrls);
      }
    })
    //update state with our filled array
    this.setState({ artifacts: filteredRefItems })
  }

  /*  Accepts 2 arrays of objects - 
      1 containing the References without duplicates and 1 containing which items were duplicates.
      See listArtifacts method for info on how these arrays are created.

      This function uses the above info to dynamically generate inline, superscript references on the page.
      They correspond to the References list and directly link to the artifact as well.
      ******* 100% Dependent on there being properly placed <a> tags in SharePoint List source *********
  */
  createInlineReferences = (filteredRefItems, dupRefUrls) => {
    //get all empty resource links on page
    let referenceSupers = [...document.querySelectorAll('.resourceLink')];
    let i = 1; //used for corresponding to reference list i.e. unique reference number
    let pos = 1; //tracks which <a> tag we target on the page i.e. in the referenceSupers array
    let dupIndex = 0; //tracks when we place a duplicate, so we don't use anything twice
    let superLength = referenceSupers.length; //loop length condition

    //store the page position of the duplicates for comparison inside loop
    let dupPos = [];
    dupRefUrls.forEach(d => {
      dupPos.push(d.position)
    })

    referenceSupers.forEach(r => {
      if (pos <= superLength) { //if we aren't to the end
        //check if the current position is meant for a duplicate
        //if position is duplicate, get info from duplicates array, incr pos and dupIndex
        if (dupPos.includes(pos)){ 
          r.innerHTML = `[${dupRefUrls[dupIndex].refNum}]`
          r.href = dupRefUrls[dupIndex].url;
          r.target = '_blank';
          r.rel = 'noopener noreferrer';
          pos += 1;
          dupIndex += 1;
        }
        //not a duplicate, incr the unique reference count (i) and position
        else {
          r.innerHTML = `[${i}]`
          r.href = filteredRefItems[i-1].props.children.props.href;
          r.target = '_blank';
          r.rel = 'noopener noreferrer';
          pos += 1;
          i += 1;
        }
      }
    })
  }

  //Grabs bdat buttons and sets the correct one to active style
  setActiveButton = () => {
    const overBtn = document.getElementById('overview-btn');
    const busBtn = document.getElementById('business-btn');
    const dataBtn = document.getElementById('data-btn');
    const appBtn = document.getElementById('application-btn');
    const techBtn = document.getElementById('technology-btn');

    //IDs correspond to sharepoint list GivenID
    //applies active class to correct button based on state
    switch (this.state.personaID) {
      case '1':
      case '2':
        overBtn.classList.add('bdatActive')
        break;
      case '12':
      case '7':
        busBtn.classList.add('bdatActive')
        break;
      case '11':
      case '8':
        dataBtn.classList.add('bdatActive')
        break;
      case '14':
      case '9':
        appBtn.classList.add('bdatActive')
        break;
      case '13':
      case '10':
        techBtn.classList.add('bdatActive')
        break;
      default:
        break;
    }
  }

  //Helper function to remove all active style before adding active style to the new page's button
  removeActiveButtonStyle = () => {
    //converts results into an array because IE is trash 
    //and can't handle something simple like querySelector returning a node list
    let bdatBtns = [...document.querySelectorAll('#bdat-links button')];
    bdatBtns.forEach(el => {
      el.classList.remove('bdatActive');
    });
  }

  //Get all detail section lists and apply the class set up for list style
  addListStyle = () => {
    //converts results into an array because IE is trash 
    //and can't handle something simple like querySelector returning a node list
    let lists = [...document.querySelectorAll('.detailSection ul')];
    lists.forEach(el => {
      el.classList.add('detailSectionList');
    });
  }

  render() {
    return (
      <div id='detail-persona-container' className='subPage'>
        <div id="back-btn">
          <Link to='../'><FontAwesomeIcon icon={faArrowLeft}/><span className='leftPad'><strong>Back to Roles</strong></span></Link>
        </div>
        <div id="top-detail" className="em-c-media-block">
          <div className="em-c-media-block__media">
            <img src={this.state.personaDetails.Image.Url} alt="Persona Avatar" className="em-c-media-block__img" />
          </div>
          <div className="em-c-media-block__body">
            <h2 className="em-c-media-block__headline roleHeading">{this.state.personaDetails.Title}</h2>
            <p className="em-c-media-block__desc">{this.state.personaDetails.Description}</p>
          </div>
        </div>
        <BDATbuttons
          visible={this.state.bdatVisible}
          overviewVisible={this.state.bdatOverviewVisible}
          buttonDisabledList={this.state.bdatDisabledList}
          overviewPath={this.state.bdatOverviewPath}
          businessPath={this.state.bdatBusinessPath}
          dataPath={this.state.bdatDataPath}
          appsPath={this.state.bdatAppsPath}
          techPath={this.state.bdatTechPath}
        />
        <div id="details-container" className='container-fluid'>
          <div className="row">
            <div className="col-sm-12 col-lg-7">
              <div className="em-l__main detailSection readable">
                <h5 className='detailCatHeading'>Responsibilities</h5>
                {ReactHtmlParser(this.state.personaDetails.KeyResponsibilities)}
              </div>
            </div>
            <div className="col-sm-12 col-lg-5">
              <div className="em-l__secondary detailSection">
                <h5 className='detailCatHeading'>Decision Rights</h5>
                {ReactHtmlParser(this.state.personaDetails.KeyDecisions)}
              </div>
            </div>
          </div>
          <div id='detail-bottom-grid' className="row">
            <div className="col-sm-12 col-lg-4 detailSection">
              <h5 className='detailCatHeading'>Interactions</h5>
              {ReactHtmlParser(this.state.personaDetails.InteractsWith)}
            </div>
            <div className="col-sm-12 col-lg-3 detailSection">
              <h5 className='detailCatHeading'>Out of Scope</h5>
              {ReactHtmlParser(this.state.personaDetails.Donts)}
            </div>
            <div className="col-sm-1"></div>
            <div className="col-sm-12 col-lg-4 detailSection">
              <h5 className='detailCatHeading'>References</h5>
              <ol id='resource-list' className='row'>
                {this.state.artifacts}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonaDetails;