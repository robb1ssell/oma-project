import React, { Component } from 'react';
import { sp } from "@pnp/sp";
import TemplateBlock from './TemplateBlock';
import InnerTemplate from './InnerTemplate';
import SearchInput, { createFilter } from 'react-search-input';
import LegendModal from './LegendModal';

//needed for SearchInput's createFilter
//search bar will only filter on props of card that are listed here
const KEYS_TO_FILTERS = [
  'props.title',
  'props.acronym',
  'props.stakeholders',
  'props.variant'
];

class Templates extends Component {
  constructor(props) {
    super(props)

    this.state = {
      templates: [],
      levelOptions: [],
      domainOptions: [],
      availableTags: [],
      selectedTags: [],
      searchTerm: '',
      levelSelected: '',
      domainSelected: '',
    }
  }

  componentDidMount = () => {
    document.title = 'OMA | Templates'
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    this.getInfo()
  }
  
  getInfo = () => {
    let templateComps = [];
    let uniqueOptions = [];
    let archLevelOptions = [];
    let archDomainOptions = [];
    let tags = [];
    let uniqueTags = [];
    
    sp.web.lists.getByTitle('OMA_Artifact_Accelerators').items.get()
    .then(items => {
      items.forEach(el => {
        let innerTemplates = [];
        let blockTags = [];
        //markup for icons inside each card
        let icon = src => <img src={src} alt=""/>;
        let option = name => <option key={name} value={name}>{name}</option>;

        //create unique Architecture level options
        if (uniqueOptions.indexOf(el.Architecture_Level) === -1) {
          uniqueOptions.push(el.Architecture_Level);
          archLevelOptions.push(option(el.Architecture_Level));
        }

        if (uniqueOptions.indexOf(el.Architecture_Domain) === -1) {
          uniqueOptions.push(el.Architecture_Domain);
          archDomainOptions.push(option(el.Architecture_Domain));
        }

        //Find each template url and create items for them
        Object.keys(el).forEach(key => {
          if (key.substr(0, 13) === 'Template_URL_') {
            if (el[key] !== null) {
              innerTemplates.push(
                <InnerTemplate
                  key={el[key].Url}
                  url={el[key].Url}
                  name={el[key].Description}
                  fileType={el[key].Url.split('.').pop()} //grabs the file extension
                />
              )
            }
          }
        })

        //go through tags on each record to create unique options
        //markup for static tags is here, dynamic tags is done within html in render
        if (el.Tags) {
          el.Tags.split('; ').forEach(tag => { //data is a list, semi-colon delineated
            if (uniqueTags.indexOf(tag.toLowerCase()) === -1) {
              uniqueTags.push(tag.toLowerCase());
              tags.push(tag); //tag options
            }
            blockTags.push(this.tagMarkup(tag)) //creates array of tag components for each template
          })
        }

        templateComps.push(
          <TemplateBlock
            key={el.ID}
            title={el.Title}
            acronym={el.Artifact_Acronym}
            icon={icon(el.Icon.Url)}
            layerIcon={icon(el.Arch_Layer_Icon.Url)}
            domainIcon={icon(el.Arch_Domain_Icon.Url)}
            desc={el.Artifact_Description}
            purpose={el.Artifact_Purpose}
            concerns={el.Concerns_Addressed}
            stakeholders={el.Stakeholders}
            templates={innerTemplates}
            variant={items[el.Stereotype_ToId] ? items[el.Stereotype_ToId - 1].Title : ''}
            archLevel={el.Architecture_Level}
            archDomain={el.Architecture_Domain}
            tags={blockTags}
          />
        )
      })
      let sortedLevels = archLevelOptions.sort((a,b) => {
        return a.props.value.localeCompare(b.props.value);
      })
      let sortedDomains = archDomainOptions.sort((a,b) => {
        return a.props.value.localeCompare(b.props.value);
      })

      this.setState({
        templates: templateComps,
        levelOptions: sortedLevels,
        domainOptions: sortedDomains,
        availableTags: tags,
      }, () => {
        this.sortAvailableTags()
      })
    })
  }

  /********* Tag Functions ******************/
  tagMarkup = text => {
    return (
      <li className="em-c-tags__item em-js-tags-item" key={text}>
        <span className="em-c-tags__link ">{text}</span>
      </li>
    );
  }

  //helper function to keep tags in alpha order
  sortAvailableTags = () => {
    const tags = [...this.state.availableTags].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
      return 0;
    });
    this.setState({ availableTags: tags });
  }

  //accepts string and adds to selected state
  addSelectedTag = tag => {
    this.setState({
      selectedTags: [...this.state.selectedTags, tag]
    })
  }

  //accepts string, adds to available state, and callback for sorting
  makeTagAvailable = tag => {
    this.setState({
      availableTags: [...this.state.availableTags, tag]
    }, () => {
      this.sortAvailableTags()
    })
  }

  //takes tag string and index, triggered by click handler on tag
  //removes tag that was clicked, moves tag from selected to available
  handleTagRemoval = (tag, i) => {
    this.setState(state => {
      const selectedTags = state.selectedTags.filter((item, j) => i !== j)
      return {
        selectedTags,
      };
    }, () => {
      this.makeTagAvailable(tag)
    });
  }

  //takes tag string and index, triggered by click handler on tag
  //removes tag that was clicked, moves tag from available to selected
  handleTagSelect = (tag, i) => {
    this.setState(state => {
      const availableTags = state.availableTags.filter((item, j) => i !== j)
      return {
        availableTags,
      };
    }, () => {
      this.addSelectedTag(tag)
    });
  }

  //search helper for search bar
  searchUpdated = term => {
    this.setState({
      searchTerm: term
    })
  }
  
  render() {
    let filteredResults = this.state.templates.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

    if (this.state.levelSelected) {
      filteredResults = filteredResults.filter(el => el.props.archLevel === this.state.levelSelected);
    }

    if (this.state.domainSelected) {
      filteredResults = filteredResults.filter(el => el.props.archDomain === this.state.domainSelected);
    }

    //for each selected tag, filter results if block does not contain ALL selected tags
    if (this.state.selectedTags.length > 0) {
      this.state.selectedTags.forEach(tag => {
        filteredResults = filteredResults.filter(el => {
          let matchFound = false; //match flag
          //loop through each result's tags
          el.props.tags.forEach(t => {
            //if result has a tag that matches, set match flag to true
            if (t.props.children.props.children.toLowerCase() === tag.toLowerCase()) {
              matchFound = true;
            }
          })
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
      <div className='container-fluid'>
        <div className="row pageHeaderBlueBG">
          <div className="em-c-page-header container whiteText">
            <h1 className="em-c-page-header__title">
              Templates
            </h1>
            <p className='em-c-page-header__desc'>
              Browse the library of MS Office, Visio, Alfabet and ARIS 
              templates that will enable you to quickly produce high-quality 
              artifacts and deliverables that clearly communicates to all 
              stakeholders.
            </p>
          </div>
        </div>
        <div id='template-filters' className="row pageSection">
          <div className="col-12 col-md-6">
            <SearchInput 
              onChange={this.searchUpdated} 
              placeholder='Search by keyword or add tags below'
              className='pb-2 '
            />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-end flex-wrap">
            <select name="arch-level" id="arch-level" onChange={e => this.setState({ levelSelected: e.target.value})}>
              <option value="">Architecture Level</option>
              {this.state.levelOptions}
            </select>
            <select name="arch-domain" id="arch-domain" onChange={e => this.setState({ domainSelected: e.target.value})}>
              <option value="">Architecture Domain</option>
              {this.state.domainOptions}
            </select>
          </div>
          <div className="col-12 d-flex justify-content-end">
            <LegendModal/>
          </div>
          <div className="col-12 pt-3">
            <span><strong>Available Tags:</strong></span>
              <ul className="em-c-tags pt-1 pb-2">
                {this.state.availableTags.map((tag, index) => (
                  <li className="em-c-tags__item em-js-tags-item pointer selectableTag" key={tag}
                    onClick={e => this.handleTagSelect(tag, index)}
                  >
                    <span className="em-c-tags__link ">{tag}</span>
                  </li>
                ))}
              </ul>
              {this.state.selectedTags.length > 0 ?
                <div id="selected-tags">
                  <span><strong>Selected Tags:</strong></span>
                  <ul className="em-c-tags pt-1 pb-2">
                    {this.state.selectedTags.map((tag, index) => (
                      <li className="em-c-tags__item em-js-tags-item pointer closableTag" key={tag}
                        onClick={() => this.handleTagRemoval(tag, index)}
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
                    ))}
                  </ul>
                </div>
                :
                ''
              }
            </div>
          </div>
        {filteredResults}
      </div>
    );
  }
}

export default Templates;