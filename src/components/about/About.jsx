import React, { Component } from 'react';
import { sp } from "@pnp/sp";
import TeamMember from './TeamMember';

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: []
    }
  }

  //common setup of sp utility
  componentDidMount = () => {
    document.title = 'OMA | About Us'
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    this.getTeamMembers();
  }

  /*gets OMA team list from Engage Sharepoint List here: 
  * https://ishareteam2.na.xom.com/sites/at/Marketing/Planning/site/Lists/Engage%20Page%20for%20AT%20Website/AllItems.aspx
  * 
  * also creates components for each person with correct info
  * uses lyncpictures API for images
  */

  createMemberComponents = items => {
    let teamComps = [];
    items.forEach(el => {
      //need domain and username separate for call to lyncpictures api
      let acctInfo = el.Member.AccountName.split('\\');
      let domain = acctInfo[0];
      let username = acctInfo[1];
      
      //split reverse formatted name, follows pattern ['last', 'first', 'middle (if exists, else /C', '/C']
      let name = el.Member.Title.split(' ');

      //pick up edge case where first name position is a single letter
      let fname = '';
      if (name[1].length <= 1 && name[2].length > 1) {
        fname = name[2]
      } else {
        fname = name[1];
      }

      //remove comma from last name
      let lname = name[0].substring(0, name[0].lastIndexOf(','));

      //sets contractor flag by looking at 3rd and 4th positions of name array
      let contractorTag = '';
      if (name[2] && name[2].charAt(0) === '/') {
        contractorTag = name[2];
      }
      else {
        contractorTag = name[3];
      }

      //removes lazy period that they used for sorting in the SP list
      let role = el.Role;

      if (role === 'Manager') {
        teamComps.unshift(
          this.makeMember(el, domain, username, fname, lname, contractorTag, role)
        );
      }
      else {
        teamComps.push(
          this.makeMember(el, domain, username, fname, lname, contractorTag, role)
        );
      }
    })

    this.setState({ team: teamComps })
  }

  makeMember = (el, domain, username, fname, lname, contractorTag, role) => {
    return (
      <TeamMember
        key={el.ID}
        ID={el.ID}
        domain={domain}
        username={username}
        fname={fname}
        lname={lname}
        contractorTag={contractorTag}
        role={role}
        blurb={el.Blurb}
        ccp={el.CCProfile}
        email={el.Member.EMail}
      />
    );
  }

  getTeamMembers = () => {
    sp.web.lists.getByTitle('OMA_Team_Members').items
    .select('*', 'Member/Title', 'Member/EMail', 'Member/AccountName')
    .expand('Member/Id').get()
    .then(items => {
      this.createMemberComponents(items);
    })
  }

  render() {
    return (
      <div id="standards">
        <div className='container-fluid'>
          <div className="row pageHeaderBlueBG">
            <div className="em-c-page-header container whiteText">
              <h1 className="em-c-page-header__title">{/* Removed due to contract */}</h1>
              <p className='em-c-page-header__desc'>
                {/* Removed due to contract */}
              </p>
            </div>
          </div>
          <div className='row pageSection'>
            <div className='container'>
              <div className="row">
                <div className="col-12">
                  <h2 className="sectionHeader mb-4">Vision & Mission</h2>
                  <div className="em-c-text-passage">
                    <h4>Our Vision</h4>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                    <h4>Our Mission</h4>
                    <p>
                      {/* Removed due to contract */}
                    </p>
                  </div>
                </div>
              </div>
              <div className='row pageSection'>
                <div className="col-12">
                  <h2 className="sectionHeader mb-4">Meet Our Team</h2>
                </div>
                  {this.state.team}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;