import React, { useState, useEffect, useRef } from 'react';
import { sp } from "@pnp/sp";
import { HashLink as Link } from 'react-router-hash-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GlossaryTermCard from './GlossaryTermCard';
import SearchInput, { createFilter } from 'react-search-input';

let rawData = [];
//needed for SearchInput's createFilter
//search bar will only filter on props of card that are listed here
const KEYS_TO_FILTERS = [
  'term',
  'abbr',
];


//Overhead for sharepoint rest API calls
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl: process.env.REACT_APP_SP_BASEURL
  },
});

// markup for hash links underneath search bar
let letterLink = letter => 
  <li key={letter} className='letterLink'>
    <Link 
      to={`/glossary#${letter}`}
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

// Pass API results as argument 'array' and parse by key to get names and links
// Returns an object of arrays that contain objects for each item's data
const groupTerms = array => {
  let acc = {};
  //loop through the keys of each data object from the API
  array.forEach(el => {
    let abbr;
    let definition;
    let seeAlso = [];
    let explanation;
    let source = {};
    let tags = [];

    //grab data we need for the matching keys
    Object.keys(el).forEach(key => {
      switch (key) {
        case 'Abbreviation':
          abbr = el[key];
          break;
        case 'Definition':
          definition = el[key];
          break;
        case 'See_Also': //multi select lookup field returns array of objects via API, even when only 1 result
          el[key].results.forEach(obj => {
            seeAlso.push(obj.Title);
          })
          break;
        case 'Explanation':
          explanation = el[key];
          break;
        case 'Source':
          source.name = el[key];
          break;
        case 'Source_URL':
          source.url = el[key] ? el[key].Url : ''
          break;
        case 'Tags':
          tags = el[key] ? el[key].split('; ').sort()
            .map(string => string.replaceAll(';', ''))
            :
            '';
          break;
        default:
          break;
      }
    })

    //After getting all data variables, create grouping of data by alpha arrays of data objects
    Object.keys(el).forEach(key => {
      if (key === 'Title') {
        rawData.push(
          {
            term: el[key], 
            abbr: abbr,
            definition: definition,
            seeAlso: seeAlso,
            explanation: explanation,
            source: source,
            tags: tags
          }
        )

        if (acc.hasOwnProperty(el[key].charAt(0).toLowerCase())) { //push to correct category if it exists
          acc[el[key].charAt(0).toLowerCase()].push(
            {
              term: el[key], 
              abbr: abbr,
              definition: definition,
              seeAlso: seeAlso,
              explanation: explanation,
              source: source,
              tags: tags
            }
          )
        } else { //if new letter category, make new obj array
          acc[el[key].charAt(0).toLowerCase()] = [
            {
              term: el[key], 
              abbr: abbr,
              definition: definition,
              seeAlso: seeAlso,
              explanation: explanation,
              source: source,
              tags: tags
            }
          ]
        }
      }
    })
  })
  return acc;
}

/******* TAG FUNCTIONS **********/
const tagMarkup = text => {
  return (
    <li className="em-c-tags__item em-js-tags-item" key={text}>
      <span className="em-c-tags__link ">{text}</span>
    </li>
  );
}

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
    <li className="em-c-tags__item em-js-tags-item pointer closableTag" key={tag}
      onClick={() => handleTagRemoval(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)}
    >
      <span className="em-c-tags__link ">
        {tag}
        <svg className="em-c-icon em-c-icon--small em-c-tags__icon-inside noClick">
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            xlinkHref={/* Removed due to contract */}
          >
          </use>
        </svg>
      </span>
    </li>
  )
}

const findAvailableTags = (data, setAvailableTags) => {
  let uniqueTags = [];
  data.forEach(item => {
    if (item.Tags) {
      let split = item.Tags.split('; ').map(string => string.replaceAll(';',''));
      split.forEach(string => {
        if (uniqueTags.indexOf(string) === -1) {
          uniqueTags.push(string);
        }
      })
    }
  })
  setAvailableTags(uniqueTags);
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

//Main component being rendered
const Glossary = props => {
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const topBtn = useRef(null);
  let sortedTags = [];

  //updates page tab title on mount
  useEffect(() => {
    document.title = 'OMA | Glossary'
  }, [])

  //Gets data from sharepoint, gets the categorized object, and sets to state when ready
  useEffect(() => {
    const getData = async () => {
      const results = await sp.web.lists.getByTitle('OMA_IT_Arch_Glossary').items
      .select('*', 'See_Also/Title')
      .expand('See_Also/Id')
      .getAll()

      findAvailableTags(results, setAvailableTags);
      setData(groupTerms(results));
    }
    getData();
  }, [])

  //add scroll listener and assign so we can clean up onscroll listener on unmount
  useEffect(() => {
    let scrollFunc = addListenerWithArgs(window, "scroll", showTopBtn, topBtn);

    return () => {
      window.removeEventListener('scroll', scrollFunc, false);
    }
  }, [])

  if (availableTags.length > 0) {
    sortedTags = availableTags.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
      return 0;
    });
  }

  //create filter based on search bar
  let filteredResults = rawData.filter(createFilter(searchTerm, KEYS_TO_FILTERS));

  //if tags are selected, the component re renders and results are filtered
  if (selectedTags.length > 0) {
    //for each selected tag, filter results if block does not contain ALL selected tags
    selectedTags.forEach(tag => {
      filteredResults = filteredResults.filter(el => {
        let matchFound = false; //match flag
        //loop through each result's tags
        if (el.tags) {
          el.tags.forEach(t => {
            if (t.toLowerCase() === tag.toLowerCase()) {
              matchFound = true;
            }
          })
        }
        if (matchFound) { //keep el if it matched
          return el;
        }
        else { //skip if it didn't match
          return false;
        }
      })
    })
  }

  return (
    <div className='container'>
      <div className="row pageHeader mr-0 ml-0">
        <div className="em-c-page-header">
          <h1 className="em-c-page-header__title blueText">IT Architecture Glossary</h1>
        </div>
      </div>
      <div className="row pageSection d-flex justify-content-center">
        <div className="col-12">
          <div className="glossarySearchWrapper">
            <SearchInput 
              onChange={string => setSearchTerm(string)}
              placeholder='Search by keyword or add tags below'
              className='pb-2 '
            />
          </div>
          <div>
            <ul className='d-flex flex-wrap justify-content-center'>
              { searchTerm === '' ?
                Object.keys(data)
                .sort((a, b) => { //standard alpha sort with exception to put special at the bottom
                  if (a === b) return 0;
                  if (a === 'special') return 1; //special not used in this instance as terms should all be alpha
                  if (b === 'special') return -1; //add if statement to groupTerms function if need for non alpha; see LinkRepo component
      
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
            <div className="availableTags mt-4">
              <h6>Available Tags:</h6>
              <div className="d-flex flex-wrap ">
                {
                  sortedTags.map((tag, index) => (
                    selectableTagMarkup(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)
                  ))
                }
              </div>
            </div>
            <div className="selectedTags mt-4">
              <h6>Selected Tags:</h6>
              <div className="d-flex flex-wrap ">
                {
                  selectedTags.map((tag, index) => (
                    closingTagMarkup(tag, index, availableTags, selectedTags, setAvailableTags, setSelectedTags)
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      { searchTerm !== '' || selectedTags.length > 0 ?
        //If there is a search term, only show filtered results
        <div className="row">
          {
            filteredResults.map(el => {
              return (
                <GlossaryTermCard 
                  key={el.term}
                  data={el}
                  tagMarkupFunc={tagMarkup}
                />
              )
            })
          }
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
              <div id={category} className="col-12">
                <h1 className='glossaryCategoryLetter blueText'>{category.toUpperCase()}</h1>
              </div>
              { //map each key of the curated data object, each key is a term data object
                data[key].map(el =>
                  <GlossaryTermCard 
                    key={el.term}
                    data={el}
                    tagMarkupFunc={tagMarkup}
                  />
                )
              }
            </div>
          )
        })
      }
      <div onClick={() => scrollToTop()} ref={topBtn} className='scrollTopBtn'>
        <FontAwesomeIcon icon={['fas', 'angle-double-up']} size='2x' color='#002F6C'/>
      </div>
    </div>
  );
};

export default Glossary;