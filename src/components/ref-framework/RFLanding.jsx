import React, { useState, useEffect } from 'react';
import Axios from 'axios';
//import { OauthSender } from 'react-oauth-flow';
import RFfilters from './v2/RFfilters';
import FileBlock from './FileBlock';
import {createFilter} from 'react-search-input'

const KEYS_TO_FILTERS = ['name', 'path']

  //helper function to lookup ID of user
const getUserId = (name, setCurrentUserId) => {
  Axios({
    method: 'GET',
    headers: {
      'accept': 'application/json;odata=verbose', // JSON Lite should be available in SP1.  If not, use odata=verbose instead
      'content-type': 'application/json;odata=verbose' // same thing, replace with odata=verbose if this doesn't work
    },
    url: process.env.REACT_APP_SP_BASEURL + "/_api/web/SiteUserInfoList/items?$filter=Title eq '"+name+"'"
  })
  .then(user => {
    setCurrentUserId(user.data.d.results[0].ID)
  })
  .catch(err => {
    console.log(err)
  })
}

const RFLanding = props => {
  //const params = props.match.params;
  const [files, setFiles] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCatergoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState();

  const handleTypeSelect = (e) => {
    setTypeFilter(e.target.value)
  }
  
  const handleCategorySelect = (e) => {
    setCatergoryFilter(e.target.value)
  }

  useEffect(() => {
    document.title = `OMA | EMAF Reference Framework`

    getUserId(props.userInfo.account.name, setCurrentUserId)
  }, [props])

  useEffect(() => {
    let temp = [];
    const getData = async () => {
      const res = await Axios.get({/* Removed due to contract */})
      res.data.forEach(el => {
        if (el.type === 'blob') {
          let fileExt = el.name.split('.').pop();
          let pathCheck = el.path.split('/').length;
          if (fileExt === 'md' && 
              el.name.charAt(0) !== '.' && 
              el.name.toLowerCase().substr(0, 6) !== 'readme' &&
              pathCheck === 3
          ) {
            temp.push(el)
          }
        }
      })
      setFiles(temp);
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const res = await Axios.get({/* Removed due to contract */})
      console.log(res)
    }
    getData()
  }, [])

  let filteredFiles = files.filter(createFilter(searchTerm, KEYS_TO_FILTERS))

  if (typeFilter) {
    filteredFiles = filteredFiles.filter(el => el.path.split('/')[0] === typeFilter)
  }
  
  if (categoryFilter) {
    filteredFiles = filteredFiles.filter(el => el.path.split('/')[1].split(' ')[0] === categoryFilter)
  }

  return(
    <div className='container'>
      <div className="row pageSection">
        <div className="em-c-page-header col-12">
          <h1 className="em-c-page-header__title blueText">EMAF Reference Framework</h1>
          <p className="em-c-page-header__desc">
            {/* Removed due to contract */}
          </p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12 col-lg-2"></div>
        <div className="col-12 col-lg-8">
          <RFfilters
            handleCategorySelect={handleCategorySelect}
            handleTypeSelect={handleTypeSelect}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            setSearchTerm={setSearchTerm}
          />

          {
            filteredFiles.map((file, i) => (
              <FileBlock file={file} key={i} userId={currentUserId}/>
            ))
          }
        </div>
        <div className="col-12 col-lg-2"></div>
      </div>
    </div>
  )
};

export default RFLanding;