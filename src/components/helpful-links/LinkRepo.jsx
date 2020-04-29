import React, { useState, useEffect, useRef } from 'react';
import { sp } from "@pnp/sp";
import { HashLink as Link } from 'react-router-hash-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// markup for links in main list
let linkMarkup = el => 
  <li key={el.name} className='helpfulLink'>
    <a 
      href={el.link}
      target='_blank'
      rel='noopener noreferrer'
    >
      {el.name}
    </a>
  </li>;

// markup for hash links underneath search bar
let letterLink = letter => 
  <li key={letter} className='letterLink'>
    <Link 
      to={`/links#${letter}`}
      scroll={el => {
        const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -80; 

        window.scrollTo({
            top: yCoordinate + yOffset,
            behavior: 'smooth'
        });
      }}
    >
      {letter.toUpperCase()}
    </Link>
  </li>

//Overhead for sharepoint rest API calls
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl: process.env.REACT_APP_SP_BASEURL
  },
});

// Pass API results as argument 'array' and parse by key to get names and links
// Returns an object of arrays that contain objects for each item's name and link
const groupTerms = array => {
  let acc = {special: []};
  array.forEach(el => {
    let link;
    Object.keys(el).forEach(key => {
      if (key === 'ArtifactLink') {
        link = el[key];
      }
    })
    Object.keys(el).forEach(key => {
      if (key === 'Title') {
        let regex = /^.{0}[a-zA-Z]/; //check first character of Title
        let isSpecial = regex.test(el[key]);
        if (!isSpecial) { //if not letter, put into separate array
          acc.special.push({name: el[key], link: link})
        } else if (acc.hasOwnProperty(el[key].charAt(0).toLowerCase())) { //push to correct category if it exists
          acc[el[key].charAt(0).toLowerCase()].push({name: el[key], link: link})
        } else { //if new letter category, make new obj array
          acc[el[key].charAt(0).toLowerCase()] = [{name: el[key], link: link}]
        }
      }
    })
  })
  return acc;
}

//Cross browser conditional display of scroll to top button
const showTopBtn = (topBtn) => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    topBtn.current.style.display = "block";
  } else {
    topBtn.current.style.display = "none";
  }
}

//On Click action for scroll to top button
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

//Taken from https://stackoverflow.com/a/31195862/10140836
//Used so I can pass the ref for the back to top button to the listener function and be able to remove it
//when component unmounts.
const addListenerWithArgs = (elem, evt, func, vars) => {
  var f = function(ff, vv){
      return (function (){
          ff(vv);
      });
  }(func, vars);

  elem.addEventListener(evt, f);

  return f;
}

// Component rendered to page
// Handles API call and sets the data to state
// Filters the list based on user input to search bar
const LinkRepo = () => {
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const topBtn = useRef(null);
  let filteredDataArr = [];
  let scrollFunc = addListenerWithArgs(window, "scroll", showTopBtn, topBtn);

  //Gets data from sharepoint, gets the categorized object, and sets to state when ready
  useEffect(() => {
    const getData = async () => {
      const results = await sp.web.lists.getByTitle('OMA_ArtifactMasterList').items.get()
      const grouped = await groupTerms(results);
      setData(grouped);
    }
    getData();
  }, [])

  //quick fix to clean up onscroll listener on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('scroll', scrollFunc, false);
    }
  }, [scrollFunc])

  //If something is in the search bar, set to lowercase for comparison
  //Set new array with items that include the search term
  if (searchTerm !== '') {
    const lowerCaseTerm = searchTerm.toLowerCase();
    filteredDataArr = Object.keys(data).map(key => { //loop each letter category
      return data[key].filter(el => { //filter objects within each category
        return el.name.toLowerCase().includes(lowerCaseTerm)
      });
    });
  }


  return (
    <div className='container-fluid'>
      <div className="row pageHeaderBlueBG">
        <div className="em-c-page-header container whiteText">
          <h1 className="em-c-page-header__title">Link Directory</h1>
          <p className='em-c-page-header__desc'>
            This page contains links to many architecture related resources
            which can aid in completing work more efficiently and effectively.
          </p>
        </div>
      </div>
      <div className="container">
        <div className="row pageSection d-flex justify-content-center">
          <div className="col-12 searchContainer">
            <div className="muted text-right pb-2">
              <a href="mailto:'email removed for contract'?subject=Suggestion for Links Page">
                Something missing? Let us know.
              </a>
            </div>
            <input 
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Looking for something in particular?'
              className='pb-2'
              id='link-search'
              value={searchTerm}
            />
            <div>
              <ul className='d-flex flex-wrap'>
                { searchTerm === '' ?
                  Object.keys(data)
                  .sort((a, b) => { //standard alpha sort with exception to put special at the bottom
                    if(a === b) return 0;
                    if (a === 'special') return 1;
                    if (b === 'special') return -1;
        
                    if (a < b)
                        return -1;
                    if (a > b)
                        return 1;
                    return 0;
                  })
                  .map(key => {
                    let category = (key === 'special') ? '*' : key;
                    return (
                      letterLink(category)
                    )
                  })
                  :
                  ''
                }
              </ul>
            </div>
          </div>
        </div>
        { searchTerm !== '' ?
          //If there is a search term, only show filtered results
          <div className="row">
            <div className="col-12 col-md-4"></div>
            <div className="col-12 col-md-8">
              <ul>
                {
                  filteredDataArr.map(item => {
                    return (
                      item.length > 0 ?
                        item.map(el => {
                          return linkMarkup(el);
                        })
                      :
                        ''
                    );
                  })
                }
              </ul>
            </div>
          </div>
          :
          //Default view when there is no search term - categorized by Alpha
          Object.keys(data)
          .sort((a, b) => { //standard alpha sort with exception to put special at the bottom
            if(a === b) return 0;
            if (a === 'special') return 1;
            if (b === 'special') return -1;

            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
          })
          .map(key => {
            let category = (key === 'special') ? '*' : key;
            return (
              <div className="row pageSection" key={key}>
                <div id={category} className="col-12 col-md-4 bottomToRightBorder">
                  <h1 className='categoryLetter ml-md-auto blueText'>{category.toUpperCase()}</h1>
                </div>
                <div className="col-12 col-md-8 ">
                  <ul className='mt-3 mt-md-0'>
                    {
                      data[key].map(el => {
                        return linkMarkup(el);
                      })
                    }
                  </ul>
                </div>
              </div>
            )
          })
        }
      </div>
      <div onClick={e => scrollToTop()} ref={topBtn} className='scrollTopBtn'>
        <FontAwesomeIcon icon={['fas', 'angle-double-up']} size='2x' color='#002F6C'/>
      </div>
    </div>
  );
};

export default LinkRepo;