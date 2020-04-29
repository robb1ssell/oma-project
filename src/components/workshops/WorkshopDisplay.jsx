import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {spListApiUrl, spConfig} from 'utils/sharepoint';
import { useHistory } from "react-router-dom";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { scaleDown as Menu } from 'react-burger-menu'
//import { Link } from 'react-router-dom'
import stickybits from 'stickybits'
import Checklist from './Checklist';
import TitleSection from './TitleSection';
import SetupSection from './SetupSection';
import FacilitateSection from './FacilitateSection';
import TakeawaySection from './TakeawaySection';
import BottomNavButtons from './BottomNavButtons';
import TopNavLarge from './TopNavLarge';
import TopNavCondensed from './TopNavCondensed';
import { isIE } from 'react-device-detect';
import ComplexitySection from './ComplexitySection';

//Scroll Listener for condensed nav bar; Assigned in useEffect in WorkshopDisplay
const topNavListener = (setShowCondensedNav) => {
  let navHider = document.querySelector('.navHider');
  let scrollY;
  
  if (window.innerWidth < 992) {
    scrollY = 250;
  }
  else {
    scrollY = 150;
  }

  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > scrollY || document.documentElement.scrollTop > scrollY) {
      navHider.style.display = "flex";
    } else {
      navHider.style.display = "none";
      setShowCondensedNav(false) //if condensed nav is open, we reset it to closed if back at the top
    }
  })
}

//State toggle for condensed navbar
const navDisplayHandler = (showCondensedNav, setShowCondensedNav) => {
  setShowCondensedNav(!showCondensedNav);
}

const WorkshopDisplay = props => {
  const params = props.match.params;
  const pageID = Number(params.pageID);
  const [data, setData] = useState({}); //current display data
  const [currentSet, setCurrentSet] = useState([]); //set of data within the phase
  const [currentChecklist, setCurrentChecklist] = useState(null);
  const [showCondensedNav, setShowCondensedNav] = useState(false);
  const [phaseList, setPhaseList] = useState([]);
  const [lastPhase, setLastPhase] = useState(false);
  const [currentPhaseOrderID, setCurrentPhaseOrderID] = useState();
  let history = useHistory();
  
  const prevHandler = () => {
    history.push(`/workshops/${params.name}/${params.phase}/${pageID - 1}`);
  }

  const nextHandler = () => {
    history.push(`/workshops/${params.name}/${params.phase}/${pageID + 1}`);
  }
  
  const setNavHandler = (history, id) => {
    history.push(`/workshops/${params.name}/${params.phase}/${id}`);
  }
  
  const phaseNavHandler = (e, history) => {
    history.push(`/workshops/${params.name}/${e.target.innerText}/1`);
  }
  
  const nextPhaseHandler = () => {
    history.push(`/workshops/${params.name}/${phaseList[currentPhaseOrderID].Title}/1`);
  }

  //Set document title dynamically as page changes
  useEffect(() => {
    if (data.Workshop) {
      document.title = `${params.name} | ${data.Workshop.Title} | ${data.Title}`
    }
  }, [data, params.name])
  
  useEffect(() => {
    if (!isIE) {
      stickybits('#wkshop-nav-wrapper', {stickyBitStickyOffset: 55, useStickyClasses: true});
    }
  }, [])

  //pull data from sharepoint and fill our current set with items that match the current workshop
  useEffect(() => {
    let temp = [];
    let list = spListApiUrl('OMA_Workshop_Facilitation_Template');
    let listWithOdata = `${list}?$select=*,Workshop/Title&$expand=Workshop/Id`
    axios.get(
      listWithOdata,
      spConfig
    )
    .then(resp => {
      resp.data.d.results.forEach(el => {
        if (el.Workshop.Title === params.phase) {
          temp.push(el);
        }
      })
      let sorted = temp.sort((a,b) => a.OrderID - b.OrderID);
      setCurrentSet(sorted);
    })
  }, [params.phase])

  //get data from list of phases, filter out the ones that don't match the parent in our url
  useEffect(() => {
    let temp = [];
    let list = spListApiUrl('OMA_Workshop_IDs');
    let listWithOdata = `${list}?$select=*,Parent/Title&$expand=Parent/Id`
    axios.get(
      listWithOdata,
      spConfig
    )
    .then(resp => {
      resp.data.d.results.forEach(el => {
        if (el.Parent.Title === params.name) {
          temp.push(el);
        }
      })
      let sorted = temp.sort((a,b) => a.OrderID - b.OrderID);
      setPhaseList(sorted);
    })
  }, [params.name])

  //For providing a checklist at the end of each phase.
  useEffect(() => {
    const getChecklists = async () => {
      let list = spListApiUrl('OMA_Phase_Checklists');
      let listWithOdata = `${list}?$select=*,Parent_Phase/Title&$expand=Parent_Phase/Id`
      let res = await axios.get(
        listWithOdata,
        spConfig
      );

      let checklist = res.filter(el => el.Parent_Phase.Title === params.phase)[0];
      setCurrentChecklist(checklist);
    }
    getChecklists();
  }, [params.phase])

  //when the pageID param changes, go through the current set and get the correct data
  useEffect(() => {
    currentSet.forEach(el => {
      if (el.OrderID === pageID) {
        setData(el);
      }
    })
  }, [currentSet, pageID])

  //Assign scroll listener to variable so it can be removed on unmount
  useEffect(() => {
    let scrollFunc;
    if (!isIE) {
      scrollFunc = topNavListener(setShowCondensedNav);
    }

    return window.removeEventListener('scroll', scrollFunc, false)
  }, [])

  useEffect(() => {
    phaseList.forEach(el => {
      if (el.Title === params.phase) { //get current phase
        setCurrentPhaseOrderID(el.OrderID)
        if (el.OrderID === phaseList.length) { //if order id is equal to length, it's the last item
          setLastPhase(true);
        }
      }
    })
  }, [params.phase, phaseList])

  return (
    <div className='container workshopTemplate'>
      <TopNavCondensed
        phaseList={phaseList}
        phaseNavHandler={phaseNavHandler}
        history={history}
        params={params}
        pageID={pageID}
        currentSet={currentSet}
        setNavHandler={setNavHandler}
        currentChecklist={currentChecklist ? currentChecklist : ''}
        navDisplayHandler={navDisplayHandler}
        showCondensedNav={showCondensedNav}
        setShowCondensedNav={setShowCondensedNav}
      />

      <TopNavLarge
        phaseList={phaseList}
        phaseNavHandler={phaseNavHandler}
        history={history}
        params={params}
        pageID={pageID}
        currentSet={currentSet}
        setNavHandler={setNavHandler}
        currentChecklist={currentChecklist ? currentChecklist : ''}
      />

      {
        pageID > currentSet.length ?
          <Checklist data={currentChecklist}/>
        :
          <div className="container">
            <TitleSection data={data}/>

            <SetupSection data={data}/>

            <FacilitateSection data={data}/>

            <ComplexitySection data={data}/>

            <TakeawaySection data={data}/>

          </div>
      }
      <BottomNavButtons
        data={data}
        params={params}
        pageID={pageID}
        prevHandler={prevHandler}
        nextHandler={nextHandler}
        currentSet={currentSet}
        currentChecklist={currentChecklist ? currentChecklist : ''}
        phaseList={phaseList}
        lastPhase={lastPhase}
        nextPhaseHandler={nextPhaseHandler}
        currentPhaseOrderID={currentPhaseOrderID}
      />
    </div>
  );
};

export default WorkshopDisplay;