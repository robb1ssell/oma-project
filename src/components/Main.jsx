import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from './home/Home';
import SPlanding from './standards-patterns/SPlanding';
import ASlanding from './arch-supp/ASlanding';
import TrainLanding from './training-svcs/TrainLanding';
import CommLanding from './community-svcs/CommLanding';
import RnRLanding from './standards-patterns/RnRLanding';
import CourseDetail from './training-svcs/CourseDetail';
import PersonaDetails from './standards-patterns/rnr-v2/PersonaDetails';
import ArchitectDirectory from './community-svcs/arch-directory/ArchitectDirectory';
import CommunityPage from './community-svcs/meetings/CommunityPage';
import MandatesPrinciples from './standards-patterns/MandatesPrinciples';
import MeetingDetails from './community-svcs/meetings/MeetingDetails';
import KeyConcepts from './standards-patterns/KeyConcepts';
import MeetingEntry from './community-svcs/meetings/MeetingEntry';
import MeetingEdit from './community-svcs/meetings/MeetingEdit';
import ArchAngleItemDisplay from './community-svcs/arch-angle/ArchAngleItemDisplay';
import About from './about/About';
import ArtifactsList from './fho-artifacts/ArtifactsList';
import ConceptsMD from './standards-patterns/ConceptsMD';
import CaseStudyLanding from './case-studies/CaseStudyLanding';
import CaseStudyDetail from './case-studies/CaseStudyDetail';
import MvapLanding from './standards-patterns/mvap/MvapLanding';
import Templates from './arch-supp/arch-templates/Templates';
import LinkRepo from './helpful-links/LinkRepo';
import GameStart from './work-like-an-arch/job-challenge/GameStart';
import Glossary from './glossary/Glossary';
import ArchEngage from './standards-patterns/arch-engage/ArchEngage';
import WorkshopDisplay from './workshops/WorkshopDisplay';
import PlaybookLanding from './workshops/PlaybookLanding';
import TechConnectLanding from './community-svcs/techconnect/TechConnectLanding';
import PhaseLanding from './workshops/PhaseLanding';
import PhaseSummary from './workshops/PhaseSummary';
//import RFLanding from './ref-framework/RFLanding';
//import RFDisplay from './ref-framework/RFDisplay';
import CareerLandingNew from './career-dev/CareerLandingNew';
import reduxtext from '../reduxtext';
import RFHome from './ref-framework/v2/RFHome';
import MarkdownDisplay from './ref-framework/v2/MarkdownDisplay';
import TrainingV2 from './training-svcs/v2/TrainingV2';
//import Sqltest from './Sqltest';

class Main extends Component {
  render() {
    return (
      <div id='router'>
        <main role='main'>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/archsupport' component={ASlanding}/>
            <Route exact path='/archsupport/archshowcase' component={CaseStudyLanding}/>
            <Route exact path='/archsupport/archshowcase/detail/:id' component={CaseStudyDetail}/>
            <Route exact path='/archsupport/templates' component={Templates}/>

            <Route exact path='/standards' component={SPlanding}/>
            <Route exact path='/standards/rnr' component={RnRLanding}/>
            <Route exact path='/standards/rnr/persona/:id' component={PersonaDetails}/>
            <Route exact path='/standards/mandates' component={MandatesPrinciples}/>
            <Route exact path='/standards/keyconcepts' component={KeyConcepts}/>
            <Route exact path='/standards/mvap' component={MvapLanding}/>
            <Route exact path='/standards/archengage' component={ArchEngage}/>

            <Route exact path='/career' component={CareerLandingNew}/>

            <Route 
              exact path='/training' 
              render={(props) => <TrainLanding {...props} userInfo={this.props.userInfo}/>}
            />
            <Route path='/training/course/:name' component={CourseDetail}/>

            <Route 
              exact path='/community/home' 
              render={(props) => <CommLanding {...props} userInfo={this.props.userInfo}/>}
            />
            <Route exact path='/community/architects' component={ArchitectDirectory}/>
            <Route exact path='/community/detail/:name' component={CommunityPage}/>
            <Route exact path='/community/detail/:name/meeting/display/:id' component={MeetingDetails}/>
            <Route exact path='/community/detail/:name/meeting/edit/:id' component={MeetingEdit}/>
            <Route exact path='/community/detail/:name/meeting/create' component={MeetingEntry}/>
            <Route exact path='/community/AAArchive/display/:id' component={ArchAngleItemDisplay}/>
            <Route exact path='/community/techconnect' component={TechConnectLanding}/>

            <Route exact path='/about' component={About}/>
            <Route exact path='/links' component={LinkRepo}/>
            <Route exact path='/artifacts' component={ArtifactsList}/>
            <Route exact path='/test/concepts' component={ConceptsMD}/>
            <Route 
              exact path='/wlaa/challenge' 
              render={(props) => <GameStart {...props} userInfo={this.props.userInfo}/>}
            />
            <Route exact path='/glossary' component={Glossary}/>

            <Route exact path='/workshops' component={PlaybookLanding}/>
            <Route exact path='/workshops/:name' component={PhaseLanding}/>
            <Route exact path='/workshops/:name/:phase/:pageID' component={WorkshopDisplay}/>
            <Route exact path='/workshops/:name/:phase' component={PhaseSummary}/>

            <Route exact path='/emaf/reference-framework' 
              render={(props) => <RFHome {...props} userInfo={this.props.userInfo}/>}
            />
            <Route exact path='/emaf/reference-framework/display/:projectId' component={MarkdownDisplay}/>
            {/**
             * 
            <Route 
              exact path='/emaf/reference-framework/:type/:category/:filename' 
              render={(props) => <RFDisplay {...props} userInfo={this.props.userInfo}/>}
            />
             */}
            <Route exact path='/dev/reduxtest' component={reduxtext}/>
            <Route exact path='/dev/trainingv2' component={TrainingV2}/>
            {/**
            <Route exact path='/dev/sqltest' component={Sqltest}/>
             * 
            <Route exact path='/emaf/reference-framework' component={RFLanding}/>
            <Route 
              exact path='/emaf/reference-framework/:type/:category/:itemfolder/:filename' 
              component={RFDisplay}
            />
             */}
            <Redirect 
              exact from='/emaf/reference-framework/:type/:category' 
              to='/emaf/reference-framework'
            />
            <Redirect 
              exact from='/emaf/reference-framework/:type' 
              to='/emaf/reference-framework'
            />
            <Redirect 
              exact from='/emaf/reference-framework/:type/:catergory/:itemfolder' 
              to='/emaf/reference-framework'
            />
          </Switch>
        </main>
      </div>
    );
  }
}

export default Main;