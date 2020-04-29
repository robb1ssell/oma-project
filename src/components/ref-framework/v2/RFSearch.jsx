import React, {useState, useEffect} from 'react';
import Axios from 'axios'

const RFSearch = props => {
  const [mainLoader, setMainLoader] = useState(false);

  useEffect(() => {
    document.title = 'OMA| EMAF RF | Search'
  }, [])

  useEffect(() => {
    let temp = [];
    const getProjects = async () => {
      const projects = await Axios.get({/* Removed due to contract */})
      console.log(projects)
      projects.data.forEach(el => {
        
      })
    }
    getProjects();
  }, [])

  return (
    <div>
      search
    </div>
  );
};

export default RFSearch;