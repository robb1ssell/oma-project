import React, { Component } from 'react';
import axios from 'axios';
import ContactCardListItem from './ContactCardListItem';
import SearchInput, { createFilter } from 'react-search-input';
import CountUp from 'react-countup';
import ArchCountBox from './ArchCountBox';
//import ArchMap from './ArchMap';
//import { HorizontalBar } from 'react-chartjs-2';
import ReactPaginate from 'react-paginate';
import moment from 'moment'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import OrgDistChart from './OrgDistChart';
//import { HashLink as Link } from 'react-router-hash-link';

//needed for SearchInput's createFilter
//search bar will only filter on props of card that are listed here
const KEYS_TO_FILTERS = [
  'props.firstName',
  'props.lastName',
  'props.prefName',
  'props.prefLastName',
  'props.archType',
  'props.l2org',
  'props.role',
  'props.area',
  'props.officeLocation'
];

const perPage = 12;
//var startCase = require('lodash.startcase'); //start case capitalizes each word in a string

class ArchitectDirectory extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      archs: [],
      newestArchs: [],
      displayedArchs: [],
      offset: 0,
      searchTerm: '',
      roleValue: '',
      locationValue: '',
      orgValue: '',
      roleOptions: [],
      locationOptions: [],
      archCounts: {},
    }
    
    this.showLoader = this.showLoader.bind(this);
    this.hideLoader = this.hideLoader.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);
    this.sideScroll = this.sideScroll.bind(this);
  }
  
  //load data from API after component loads
  componentDidMount = () => {
    document.title = 'OMA | Architect Directory'
    const contacts = [];
    const roles = [];
    const locations = [];
    const l2orgs = [];
    let newestArchs = [];
    let lanID;
    let region;
    let name;
    let fname;
    let lname;
    let ccProfile;
    let archType;
    
    let totalArchCount = 0;
    
    let orgBarData = {};
    let archCounts = {};
    this.showLoader(); //displays Unity loader - controlled with CSS. see functions below.
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
      console.log(response.data.d.results);
      //loop through each result to create contact cards
      response.data.d.results.forEach(el => {
        lanID = el.Name.LANID;
        region = '';
        if (lanID) {
          region = lanID.substring(0, lanID.lastIndexOf("\\"));
        }
        
        //let username = '';
        //username = email.substring(0, email.lastIndexOf("@"));

        name = el.Name.Name.split(' ');
        fname = name[1];
        lname = name[0].substring(0, name[0].lastIndexOf(','));
        fname = fname.toLowerCase();
        lname = lname.toLowerCase();
        
        archType = '';
        if(el.ArchitectTitle) {
          if(el.ArchitectTitle.indexOf('-') !== -1) {
            archType = el.ArchitectTitle.substring(0, el.ArchitectTitle.lastIndexOf(" - "));
          }
          else {
            archType = el.ArchitectTitle;
          }
        }

        //hacky fix for weird sharepoint interaction with this field
        //normally hyperlink fields return as objects, but because of upload method
        //a double string is being returned, so we need to split and store the first one
        if (el.CCProfile) {
          let ccSplit = el.CCProfile.split(', ');
          ccProfile = ccSplit[0];
        }

        let acmDes = '';
        switch (el.ACMDesignationValue) {
          case '1':
            acmDes = {/* Removed due to contract */}
            break;
          case '2':
            acmDes = {/* Removed due to contract */}
            break;
          case '3':
            acmDes = {/* Removed due to contract */}
            break;
          case '4':
            acmDes = {/* Removed due to contract */}
            break;
          default:
            break;
        }

        newestArchs.push(
          {
            addedDate: el.Created,
            firstName: el.PreferredFirstName ? el.PreferredFirstName : fname,
            lastName: el.PreferredLastName ? el.PreferredLastName : lname,
            archType: archType,
            area: el.FocusArea,
            location: el.LocationValue,
            picUrl: `http://lyncpictures/service/api/image/${region}_${el.Name.UserName}`,
            profile: (el.CCProfile !== null) ? ccProfile : {/* Removed due to contract */},
          }
        );

        //populate array with components and their information to be set in state
        contacts.push(
          <ContactCardListItem
            key={el.NameId}
            firstName={fname}
            lastName={lname}
            prefName={el.PreferredFirstName}
            prefLastName={el.PreferredLastName}
            archType={archType}
            role={el.ArchitectureRoleValue}
            area={el.FocusArea}
            officeLocation={el.LocationValue}
            email={el.Name.WorkEmail}
            phone={el.Name.WorkPhone}
            profileLink={(el.CCProfile !== null) ? ccProfile : {/* Removed due to contract */}}
            profilePicture={`http://lyncpictures/service/api/image/${region}_${el.Name.UserName}`}
            noPic={{/* Removed due to contract */}}
            sip={el.Name.SIPAddress}
            l2org={el.L2Org}
            acmLevel={acmDes}
            openCA={el.OpenCA_LevelValue}
            safeCert={el.SAFECertification}
            togCert={el.TOGCertificationsValue}
            damaCert={el.DAMA_CertificationValue}
            acclaimLink={el.AcclaimLink ? el.AcclaimLink : ''}
          />
        );
        //this.tallyArch(el.ArchitectureRoleValue);
        //populate arrays of role and location options for dropdown filters
        //does not add to array if already there
        if (roles.indexOf(el.ArchitectureRoleValue) === -1) {
          roles.push(el.ArchitectureRoleValue)
        }
        //tally each arch type for chart
        if (el.ArchitectureRoleValue !== 'Data Architect') {
          if (archCounts[el.ArchitectureRoleValue]) {
            archCounts[el.ArchitectureRoleValue]++;
            totalArchCount++;
          }
          else {
            archCounts[el.ArchitectureRoleValue] = 1;
            totalArchCount++;
          }
        }

        if (locations.indexOf(el.LocationValue) === -1) {
          locations.push(el.LocationValue)
        }

        //remove GSC EMIT to clean up, ignore nulls
        if (el.L2Org !== null) {
          if (l2orgs.indexOf(el.L2Org.slice(9)) === -1) {
            l2orgs.push(el.L2Org.slice(9))
          }
          //tally each org type for chart
          if (orgBarData[el.L2Org]) {
            orgBarData[el.L2Org]++;
          }
          else {
            orgBarData[el.L2Org] = 1;
          }
        }

      }); //end of forEach

      let dateSorted = newestArchs.sort((a,b) => {
        return moment(b.addedDate) - moment(a.addedDate);
      })

      // sort role and location options into alphabetical order
      roles.sort();
      locations.sort();
      l2orgs.sort();
      
      //method for sorting object alphabetically
      let sortedBarData = {};
      Object.keys(orgBarData).sort().forEach(key => {
        sortedBarData[key] = orgBarData[key]
      })
      
      this.formatBarData(sortedBarData);

      //create array of option components to fill in role select
      let roleOptions = roles.map((r, index) => {
        return (
          <option 
            key={index}
            value={r}
            >
            {r}
          </option>
        )
      })

      //create array of option components to fill in location select
      let locationOptions = locations.map((l, index) => {
        return (
          <option 
            key={index}
            className='locationOption' 
            value={l}
          >
          {l}
          </option>
        )
      })

      //create array of option components to fill in location select
      let orgOptions = l2orgs.map((o, index) => {
        return (
          <option 
            key={index}
            value={o}
          >
          {o}
          </option>
        )
      })

      let pageCount = Math.ceil(contacts.length / perPage) //Set the number of pages for pagination
      
      this.hideLoader(); //hides loader just before setState and render
      
      //set state for architects and dropdown options
      this.setState({
        archs: contacts,
        newestArchs: dateSorted.slice(0, 5),
        roleOptions: roleOptions,
        locationOptions: locationOptions,
        OrgOptions: orgOptions,
        orgBarData: orgBarData,
        totalArchs: totalArchCount,
        archCounts: archCounts,
        pageCount: pageCount,
      }, () => {
        this.setDisplayedArchs();
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  setDisplayedArchs = () => {
    let lower = this.state.offset;
    let upper = this.state.offset + perPage;
    let archsToDisplay = [];

    this.state.archs.forEach((el, index) => {
      if (index >= lower && index < upper) {
        archsToDisplay.push(el)
      }
    });

    this.setState({ displayedArchs: archsToDisplay });
  }

  //Runs when the pagination is changed
  handlePageClick = data => {
    let offset = Math.ceil(data.selected * perPage);
    this.setState({
      offset: offset
    }, () => {
      this.setDisplayedArchs();
    });
  };

  //Create data object in layout specified by charts.js and store in state
  formatBarData = (orgBarData) => {
    let formattedBarData = [];
    //let labels = [];
    //let data = [];
    for (let item in orgBarData) {
      formattedBarData.push(
        {
          'label': item.slice(9),
          'value': orgBarData[item]
        }
      )
      //labels.push(item.slice(9));
      //data.push(orgBarData[item])
    }

    
    /*
    let formattedBarData = {
      labels: labels,
      datasets: [
        {
          backgroundColor: '#002F6C',
          borderColor: '#00A3E0',
          borderWidth: 1,
          hoverBackgroundColor: '#002F6C',
          hoverBorderColor: '#ED8B00',
          data: data
        }
      ]
    }
     */

    this.setState({
      formattedOrgData: formattedBarData
    })
  }

  //displays Unity loader
  showLoader = () => {
    const loader = document.querySelector('#arch-loader');
    loader.style.display = 'block';
  }

  //hides Unity Loader
  hideLoader = () => {
    const loader = document.querySelector('#arch-loader');
    loader.style.display = 'none';
  }

  //updates state with user input in search bar
  //causes re render and new results
  searchUpdated = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  //handles scrolling for side bar anchor links
  //adds offset to account for header and uses smooth scrolling
  sideScroll = (el) => {
    const element = el;
    const offset = 76;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  //click handler for org distribution chart on top of page
  setFilterFromChart = (str) => {
    this.setState({ orgValue: str })
  }

  //sets state of all filters and search back to default null value
  clearDirectoryFilters = () => {
    this.setState({
      searchTerm: '',
      roleValue: '',
      locationValue: '',
      orgValue: '',
    })
  }

  //sets role filter via click handler on arch count tiles
  setRoleFromCount = e => {
    this.setState({
      roleValue: `${e.target.getAttribute('archtype')} Architect`
    })
  }

  render() {
    //filter on what is in the search bar
    let filteredResults = this.state.archs.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    //filter further if there is a role selected
    if (this.state.roleValue !== '') {
      filteredResults = filteredResults.filter(item => item.props.role === this.state.roleValue);
    }
    //filter further if there is a location selected
    if (this.state.locationValue !== '') {
      filteredResults = filteredResults.filter(item => item.props.officeLocation === this.state.locationValue);
    }
    //filter further if there is an org selected
    if (this.state.orgValue !== '') {
      filteredResults = filteredResults.filter(item => item.props.l2org.includes(this.state.orgValue));
    }

    return (
      <div id='architects' className='container-fluid subPage'>
        <div className="flex-xl-nowrap row">
          <div className="col-12">
            <div id='arch-graphs' className=''>
              <div id='graphs-top' className="row">
                <div id='arch-count-container' className="col-12 col-lg-3">
                  <div className="total-archs">
                    <h4>Total Architects</h4>
                    <div className="counter">
                      <CountUp end={this.state.totalArchs ? this.state.totalArchs : 0} duration={5}/>
                    </div>
                  </div>
                  <div className="row">
                    <ArchCountBox id={'chief-count'} archType={'Chief'} clickHandler={e => this.setRoleFromCount(e)} end={this.state.archCounts['Chief Architect'] ? this.state.archCounts['Chief Architect'] : 0}/>
                    <ArchCountBox id={'ent-count'} archType={'Enterprise'} clickHandler={e => this.setRoleFromCount(e)} end={this.state.archCounts['Enterprise Architect'] ? this.state.archCounts['Enterprise Architect'] : 0}/>
                    <ArchCountBox id={'cap-count'} archType={'Capability'} clickHandler={e => this.setRoleFromCount(e)} end={this.state.archCounts['Capability Architect'] ? this.state.archCounts['Capability Architect'] : 0}/>
                    <ArchCountBox id={'dom-count'} archType={'Domain'} clickHandler={e => this.setRoleFromCount(e)} end={this.state.archCounts['Domain Architect'] ? this.state.archCounts['Domain Architect'] : 0}/>
                    <ArchCountBox id={'sol-count'} archType={'Solution'} clickHandler={e => this.setRoleFromCount(e)} end={this.state.archCounts['Solution Architect'] ? this.state.archCounts['Solution Architect'] : 0}/>
                    <ArchCountBox id={'sys-count'} archType={'System'} clickHandler={e => this.setRoleFromCount(e)} end={this.state.archCounts['System Architect'] ? this.state.archCounts['System Architect'] : 0}/>
                  </div>
                </div>
                <div className="col-sm-12 col-lg-4">
                  <h4 className='centerText'>Business Areas</h4>
                  <div className="d-flex justify-content-center">
                    <OrgDistChart clickHandler={this.setFilterFromChart} orgData={this.state.formattedOrgData}/>
                  </div>
                  {/**
                  <HorizontalBar 
                    data={this.state.formattedOrgData}
                    legend={{display: false}}
                    height={400}
                    width={450}
                    //getElementAtEvent={e => this.setFilterFromChart(e)}
                    ref={chart => this.orgChartRef = chart}
                    //options={{onClick: (e, activeElems) => this.setFilterFromChart(e, activeElems)}}
                  />
                   */}
                </div>
                <div className="col-sm-12 col-lg-5">
                  <h4 className='centerText'>Our Newest Architects</h4>
                  {
                    this.state.newestArchs.map(el => (
                      <a key={el.profile} href={el.profile} className="em-c-tile em-c-tile--blue newestArchTile">
                        <img src={el.picUrl} alt="" className='mySitePic'/>
                        <h5 className='pl-2'>{`${el.firstName} ${el.lastName}`}</h5>
                        <div className="d-flex flex-col pl-2 mr-auto">
                          <span className="em-c-tile__desc newArchType">{el.archType}</span>
                          <span className="em-c-tile__desc newArchFocus">{el.area}</span>
                        </div>
                        <div className='ml-auto'><strong>{moment(el.addedDate).format('MM-DD-YY')}</strong></div>
                      </a>
                    ))
                  }
                  {/**
                  <ArchMap/>
                   */}
                </div>
              </div>
            </div>

            <div id="arch-directory" className='pb-5'>
              {/*<h2 className='sectionHeader'>Architect Directory</h2>*/}
              <div id="arch-filters">
                <SearchInput onChange={this.searchUpdated} value={this.state.searchTerm}/>
                <div id="arch-drop-downs">
                  <select 
                    onChange={e => this.setState({ roleValue: e.target.value })} 
                    value={this.state.roleValue}
                    className='em-c-select'
                  >
                    <option value="">Role</option>
                    {this.state.roleOptions}
                  </select>
                  <select 
                    onChange={e => this.setState({ locationValue: e.target.value })}
                    className='em-c-select'
                    value={this.state.locationValue}
                  >
                    <option value="">Location</option>
                    {this.state.locationOptions}
                  </select>
                  <select 
                    onChange={e => this.setState({ orgValue: e.target.value })}
                    className='em-c-select'
                    value={this.state.orgValue}
                  >
                    <option value="">Organization</option>
                    {this.state.OrgOptions}
                  </select>
                  {
                    this.state.searchTerm || this.state.roleValue || this.state.locationValue || this.state.orgValue ?
                      <div onClick={this.clearDirectoryFilters} className='mr-auto pl-xl-3 mt-1 pointer d-flex align-items-center'>
                        <FontAwesomeIcon icon={['fas', 'times']} />
                        <span className='pl-1'>Clear Filters</span>
                      </div>
                    :
                    ''
                  }
                  <div className='muted' id='arch-source'>
                    <a 
                      href={/* Removed due to contract */}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      View Source List
                    </a>
                    <div>
                      <a href={/* Removed due to contract */}>Notice something wrong? Let us know.</a>
                    </div>
                  </div>
                </div>
              </div>
              <div id='arch-loader' className="em-c-loader ">
                <img src={/* Removed due to contract */} alt="Loading" />
              </div>
              <div id="arch-cards"
                className={
                  `${this.state.searchTerm || this.state.roleValue || this.state.orgValue || this.state.locationValue ?
                  'archCardOverflow' : ''} hideScrollBar`
                }
              >
                <ul className="em-c-contact-card-list em-l-grid em-l-grid--4up em-l-grid--break-slow">
                  {this.state.searchTerm || this.state.roleValue || this.state.orgValue || this.state.locationValue ? 
                    filteredResults : this.state.displayedArchs
                  }
                </ul>
              </div>
              <ReactPaginate
                previousLabel={
                  <svg className="em-c-icon em-c-icon--small em-c-pagination__icon" data-em-icon-path={/* Removed due to contract */}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={/* Removed due to contract */}></use>
                  </svg>
                }
                nextLabel={
                  <svg className="em-c-icon em-c-icon--small em-c-pagination__icon" data-em-icon-path={/* Removed due to contract */}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={/* Removed due to contract */}></use>
                  </svg>
                }
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={this.handlePageClick}
                containerClassName={
                  `${this.state.searchTerm || this.state.roleValue || this.state.orgValue || this.state.locationValue ?
                    'hidden': ''
                    }
                    em-c-pagination meetingPagination`
                }
                pageClassName={'em-c-pagination__item pointer'}
                pageLinkClassName={'em-c-pagination__link pointer'}
                activeLinkClassName={'em-is-current'}
                previousClassName={'em-c-pagination__item pointer'}
                previousLinkClassName={'em-c-pagination__link pointer'}
                nextClassName={'em-c-pagination__item pointer'}
                nextLinkClassName={'em-c-pagination__link pointer'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ArchitectDirectory;