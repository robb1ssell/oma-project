import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProjectBlock from './ProjectBlock';
import moment from 'moment-timezone'
import {createFilter} from 'react-search-input'
import RFSearchbar from './RFSearchbar';
import RFDropdowns from './RFDropdowns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactPaginate from 'react-paginate';
import {sendEmail} from 'utils/email'

//gitlab group id
const groupId = 4101;

//constant for pagination; number of items per page
const perPage = 6;

//keys in object to search with search bar
const KEYS_TO_FILTERS = ['name', 'desc']

const addStar = (projectId, setUserStars, setProjectData, setArchTypeOptions, setCategoryOptions, setAvailableTags, gitlabUserInfo) => {
  axios({
    method: 'post',
    url: `/api/gitlab/star-action?projectId=${projectId}&action=star`
  })
  .then(resp => {
    console.log(resp.data)
    getProjects(setProjectData, setArchTypeOptions, setCategoryOptions, setAvailableTags);
    getStarsForUser(setUserStars, gitlabUserInfo);
  })
}

const removeStar = (projectId, setUserStars, setProjectData, setArchTypeOptions, setCategoryOptions, setAvailableTags, gitlabUserInfo) => {
  axios({
    method: 'post',
    url: `/api/gitlab/star-action?projectId=${projectId}&action=unstar`
  })
  .then(resp => {
    console.log(resp.data)
    getProjects(setProjectData, setArchTypeOptions, setCategoryOptions, setAvailableTags);
    getStarsForUser(setUserStars, gitlabUserInfo);
  })
}

const compareValues = (key, order = 'desc') => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

//get project data and set options for dropdowns and tags
const getProjects = async (setProjectData, setArchTypeOptions, setCategoryOptions, setAvailableTags) => {
  let tempProjects = [];
  let categories = [];
  let archtypes = [];
  let tagOptions = [];
  const projects = await fetch(`/api/gitlab/group-projects?groupId=${groupId}&include_subgroups=true`)
    .then(response => response.text())
    .then(dataStr => {
      let data = JSON.parse(dataStr);
      return data;
    })
    .catch(err => {
      console.log(err)
    })
  //console.log('project data',projects)
  projects.forEach(el => {
    let projectObj = {};
    let pathSplit = el.name_with_namespace.split(' / ')
    let type = '';
    let category = '';
    let tags = el.tag_list;
    // getting path variables; ignore first and last elements of split array
    for (let i = 1; i < pathSplit.length; i++) {
      if (pathSplit[i] !== '' && i !== pathSplit.length - 1) {
        // path naming convention should follow: [0-n]-string-string
        let pathPartSplit = pathSplit[i].split('-');
        // edge case condition for a 1 word category
        if (pathPartSplit.length === 1) {
          category = pathPartSplit[0]
        }
        let pathPart = `${pathPartSplit[1]} ${pathPartSplit[2]}`;
        // L1 refers to the type and L2 refers to the category within the type
        // Not supporting beyond that currently
        switch (i) {
          case 1:
            type = pathPart;
            break;
          case 2:
            if (category === '') {
              category = pathPart.split(' ')[0];
            }
            break;
          default:
            break;
        }
      }
    }

    projectObj['id'] = el.id;
    projectObj['name'] = el.name;
    projectObj['desc'] = el.description;
    projectObj['tags'] = el.tag_list.map(el => el.toLowerCase());
    projectObj['stars'] = el.star_count;
    projectObj['forks'] = el.forks_count;
    projectObj['openIssues'] = el.open_issues_count;
    projectObj['lastActivity'] = el.last_activity_at;
    projectObj['type'] = type;
    projectObj['category'] = category;

    if (type !== 'Reference Model') {
      if (type !== '') {
        if (archtypes.indexOf(type.toLowerCase()) === -1) {
          archtypes.push(type.toLowerCase())
        }
      }
  
      if (category !== '') {
        if (categories.indexOf(category.toLowerCase()) === -1) {
          categories.push(category.toLowerCase())
        }
      }
  
      tempProjects.push(projectObj)
  
      tags.forEach(tag => {
        if (tagOptions.indexOf(tag.toLowerCase()) === -1) {
          tagOptions.push(tag.toLowerCase());
        }
      })
    }
  })

  let sortedData = tempProjects.sort(compareValues('stars'));

  setProjectData(sortedData)
  setArchTypeOptions(archtypes)
  setCategoryOptions(categories)
  setAvailableTags(tagOptions)
}

// lookup user stars on gitlab and set the star buttons accordingly
const getStarsForUser = async (setUserStars, gitlabUserInfo) => {
  let temp = [];
  const stars = await axios.get(`/api/gitlab/user-stars?id=${gitlabUserInfo.id}`)
  stars.data.forEach(repo => {
    temp.push(repo.id)
  })
  setUserStars(temp)
}

/*
//useful for sending an email on error
const sendErrorEmail = (emailProps) => {
  sp.utility.sendEmail(emailProps).then(_ => {
    console.log("An error occurred and an email has been sent to the admin.");
  });
}
 */

//helper function to lookup ID of user
const getUserId = (name, setUserDomainEmail) => {
  axios({
    method: 'GET',
    withCredentials: true,
    headers: {
      'Accept': "application/json;odata=verbose",
    },
    url: process.env.REACT_APP_SP_BASEURL + "_api/web/SiteUserInfoList/items?$filter=Title eq '"+name+"'"
  })
  .then(user => {
    const lanID = user.data.d.results[0].AccountName.split('\\')
    const domain = lanID[0].toLowerCase();
    const username = lanID[1];
    setUserDomainEmail(`${username}@${domain}.xom.com`)
  })
  .catch(err => {
    console.log(err)
  })
}

/******* TAG FUNCTIONS *********
const tagMarkup = text => {
  return (
    <li className="em-c-tags__item em-js-tags-item" key={text}>
      <span className="em-c-tags__link ">{text}</span>
    </li>
  );
}
*/
const selectableTagMarkup = (tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags) => {
  return (
    <li className="em-c-tags__item em-js-tags-item pointer selectableTag" key={tag}
      onClick={() => handleTagSelect(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)}
    >
      <span className="em-c-tags__link ">{tag}</span>
    </li>
  )
}

const closingTagMarkup = (tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags) => {
  return (
    <li className="em-c-tags__item em-js-tags-item pointer closableTag mb-0" key={tag}
      onClick={() => handleTagRemoval(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)}
    >
      <span className="em-c-tags__link ">
        {tag}
        <FontAwesomeIcon
          icon={['fas', 'times']}
          className='em-c-icon em-c-icon--small em-c-tags__icon-inside noClick'
        />
      </span>
    </li>
  )
}

//tag select and removal based on index in the state array at the time it's clicked
//each state is then updated to reflect the tag moving

const handleTagSelect = (tag, index, available, selected, setAvailableTags, setSelectedTags) => {
  const newAvailable = available.filter((item, j) => index !== j)
  setAvailableTags(newAvailable);
  setSelectedTags([...selected, tag]);
}

const handleTagRemoval = (tag, index, available, selected, setAvailableTags, setSelectedTags) => {
  const newSelected = selected.filter((item, j) => index !== j)
  setSelectedTags(newSelected);
  setAvailableTags([...available, tag]);
}

const RFHome = props => {
  const [userDomainEmail, setUserDomainEmail] = useState(null);
  const [gitlabUserInfo, setGitlabUserInfo] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [userStars, setUserStars] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCatergoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [archTypeOptions, setArchTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  let sortedTags = [];

  const handleTypeSelect = (e) => {
    setTypeFilter(e.target.value)
  }
  
  const handleCategorySelect = (e) => {
    setCatergoryFilter(e.target.value)
  }

  //reset all filters - used by clear filters button
  const clearFilters = () => {
    sortedTags = [];
    setSearchTerm('');
    setTypeFilter('');
    setCatergoryFilter('');
    setAvailableTags([...availableTags, ...selectedTags]);
    setSelectedTags([]);
  }

  useEffect(() => {
    document.title = 'OMA | EMAF Reference Framework'

    fetch('/health')
    .then(resp => {
      console.log('Server Status:', resp.status)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  //looks for user's email using sharepoint directory lan id
  //need this email to do a user search in gitlab
  useEffect(() => {
    if (!userDomainEmail) {
      getUserId(props.userInfo.account.name, setUserDomainEmail, props.userInfo.jwtAccessToken)
    }
  }, [props, userDomainEmail])

  //once we have the domain email, find the user in gitlab and store details in state
  //if we don't find anyone or find more than 1 match, send an error email to the admin (env variable)
  useEffect(() => {
    if (userDomainEmail) {
      const getUsers = async () => {
        const res = await axios.get(`/api/gitlab/user-search?username=${userDomainEmail}`)
        if (res.status === 200 && res.data.length === 1) {
          setGitlabUserInfo(res.data[0])
        }
        else {
          const emailData = {
            subject: "Reference Framework Error | Gitlab User Not Found",
            body: {
              contentType: "text/html",
              content: `
                From: ref-framework/v2/RFHome: <br/>
                Error Code: ${res.status} <br/>
                Error Message: ${res.statusText} <br/>
                <h3>Username Not Found: ${userDomainEmail}</h3><br/>
                Data Length (should = 1): ${res.data.length} <br/>
                User: ${props.userInfo.account.name} <br/>
                EM Email: ${props.userInfo.account.userName} <br/>
              `
            },
            from: "", //removed due to contract
            to: [process.env.REACT_APP_ADMIN_ERROR_EMAIL]
          }
          sendEmail(emailData);
        }
      }
      getUsers()
    }
  }, [props, userDomainEmail])

  useEffect(() => {
    getProjects(setProjectData, setArchTypeOptions, setCategoryOptions, setAvailableTags);
  }, [])
  
  useEffect(() => {
    if (gitlabUserInfo) {
      getStarsForUser(setUserStars, gitlabUserInfo);
    }
  }, [gitlabUserInfo])

  useEffect(() => {
    if (projectData.length > 0) {
      setPageCount(_ => Math.ceil(projectData.length / perPage))
    }
  }, [projectData])

    //Runs when the pagination is changed
  const handlePageClick = data => {
    let offset = Math.ceil(data.selected * perPage);
    window.scrollTo(0,300);
    setOffset(offset);
    showProjects();
  };

  //Uses offset calculated by selected page and perPage constant to know which data to display on which page
  const showProjects = useCallback(
    () => {
      let lower = offset;
      let upper = offset + perPage;
      let temp = [];
      
      projectData.forEach((el, index) => {
        if (index >= lower && index < upper) {
          temp.push(el)
        }
      });
      setDisplayedProjects(temp);
    },
    [offset, projectData]
  )

  useEffect(() => {
    if (projectData.length > 0) {
      showProjects();
    }
  }, [projectData, showProjects])

  let filteredData = projectData.filter(createFilter(searchTerm, KEYS_TO_FILTERS))

  if (typeFilter) {
    filteredData = filteredData.filter(el => el.type.toLowerCase() === typeFilter)
  }
  
  if (categoryFilter) {
    filteredData = filteredData.filter(el => el.category.toLowerCase() === categoryFilter)
  }

  if (availableTags.length > 0) {
    sortedTags = availableTags.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
      return 0;
    });
  }

  //if tags are selected, the component re renders and results are filtered
  if (selectedTags.length > 0) {
    //for each selected tag, filter results if block does not contain ALL selected tags
    selectedTags.forEach(tag => {
      filteredData = filteredData.filter(el => el.tags.includes(tag))
    })
  }

  let dataToDisplay = displayedProjects;
  if (searchTerm || typeFilter || categoryFilter || selectedTags.length > 0) {
    dataToDisplay = filteredData;
  }

  return (
    <div className='container'>
      <div className="row pageSection">
        <div className="em-c-page-header col-12">
          <h1 className="em-c-page-header__title blueText">EMAF Reference Framework</h1>
          <p className="em-c-page-header__desc">
            {/* Removed due to contract */}
          </p>
        </div>
      </div>
      <div id="emaf-tag-wrapper">
        <div className="availableTags mt-4">
          <div className="d-flex flex-wrap ">
            {
              sortedTags.map((tag, index) => (
                selectableTagMarkup(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)
              ))
            }
          </div>
        </div>
      </div>
      <div id='emaf-filters' className="d-flex flex-column">
        <RFSearchbar
          setSearchTerm={setSearchTerm}
        />
        <div className="d-flex flex-column flex-lg-row align-items-center">
          <RFDropdowns
            archTypeOptions={archTypeOptions}
            categoryOptions={categoryOptions}
            handleCategorySelect={handleCategorySelect}
            handleTypeSelect={handleTypeSelect}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
          />
          <div className="d-flex flex-wrap selectedTags ml-auto mr-auto ml-lg-0 mt-2 mb-2">
            {
              selectedTags.map((tag, index) => (
                closingTagMarkup(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)
              ))
            }
          </div>
          {
            searchTerm || typeFilter || categoryFilter || selectedTags.length > 0 ?
              <div onClick={clearFilters} className='ml-auto mr-auto mr-lg-0 pl-xl-3 mt-1 pointer d-flex align-items-center clearFiltersBtn'>
                <FontAwesomeIcon icon={['fas', 'times']} />
                <span className='pl-1'>Clear Filters</span>
              </div>
            :
            ''
          }
        </div>
      </div>
      <div className="container fileContainer mb-5">
        {
          projectData && userStars ?
            <div className='fileBlockWrapper mr-auto ml-auto'>
              {
                dataToDisplay.map(el => (
                  <ProjectBlock
                    key={el.id}
                    id={el.id}
                    type={el.type}
                    category={el.category}
                    name={el.name}
                    desc={el.desc}
                    issueCount={el.openIssues}
                    starCount={el.stars}
                    lastActivity={moment.tz(el.last_activity_at, "America/Chicago").format('MM/DD/YY, k:mm z')}
                    forksCount={el.forks}
                    tags={el.tags}
                    starred={userStars.includes(el.id)} //true or false based on list of user's starred projects
                    addStar={addStar}
                    removeStar={removeStar}
                    setUserStars={setUserStars}
                    setProjectData={setProjectData}
                    gitlabUserInfo={gitlabUserInfo}
                    setArchTypeOptions={setArchTypeOptions}
                    setCategoryOptions={setCategoryOptions}
                    setAvailableTags={setAvailableTags}
                  />
                ))
              }
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={['fas', 'caret-left']} />}
                nextLabel={<FontAwesomeIcon icon={['fas', 'caret-right']} />}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={`${searchTerm ? 'hidden': ''} em-c-pagination meetingPagination`}
                pageClassName={'em-c-pagination__item pointer'}
                pageLinkClassName={'em-c-pagination__link pointer'}
                activeLinkClassName={'em-is-current'}
                previousClassName={'em-c-pagination__item pointer'}
                previousLinkClassName={'em-c-pagination__link pointer'}
                nextClassName={'em-c-pagination__item pointer'}
                nextLinkClassName={'em-c-pagination__link pointer'}
              />
            </div>
          :
            <div className="d-flex justify-content-center">
              <div className="em-c-loader ">
                <img src={/* Removed due to contract */} alt="Loading" />
              </div>
            </div>
        }
      </div>
    </div>
  );
};

export default RFHome;

/*
useEffect(() => {
  let temp = []
  const getSubgroups = async () => {
    const subgroups = await axios.get(`https://gitserver.xtonet.com/api/v4/groups/4101/subgroups`)
    subgroups.data.forEach(el => {
      temp.push(
        {
          id: el.id,
          type: el.name.split('_')[0],
          category: el.name.split('_')[1],
          desc: el.description,
        }
      )
    })
    setSubgroups(temp)
  }
  getSubgroups();
}, [])
 */