import React, { Component } from 'react';
import SearchInput, { createFilter } from 'react-search-input';
import { sp } from "@pnp/sp";

const KEYS_TO_FILTER = [
  'props.children'
];

class KeyConcepts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      slideID: 275, //change this to default slide to show
      ppt: null,
      searchTerm: '',
      concepts: [],
    }
  }
  
  componentDidMount = () => {
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    this.getConcepts();
  }
  
  getConcepts = () => {
    let conceptsListItems = [];
    sp.web.lists.getByTitle("OMA_Key_Concepts").items.get()
    .then(items => {
      items.sort((a, b) => {
        return b.SortPriority - a.SortPriority;
      })

      items.forEach(el => {
        if (!el.isParent && el.ChildOfId === null) {
          conceptsListItems.push(
            <li 
              key={el.Title}
              onClick={e => this.addPPTtoState(el.SlideID)}
            >
              {el.Title}
            </li>
          );
        }

        if (el.isParent) {
          let children = [];
          items.forEach(child => {
            if (child.ChildOfId === el.ID) {
              children.push(
                <li 
                  key={child.Title}
                  onClick={e => this.addPPTtoState(child.SlideID)}
                >
                  {child.Title}
                </li>
              );
            }
          });//end of getting children
          conceptsListItems.push(
            <li key={el.Title}>
              <p onClick={e => this.addPPTtoState(el.SlideID)}>{el.Title}</p>
              <ul className='concept-children'>
                {children}
              </ul>
            </li>
          )
        }
      })

      this.setState({
        concepts: conceptsListItems
      }, () => {
        this.addPPTtoState();
      })
    })
  }

  //get new markup with correct slide set in URL, add to state so page re renders
  addPPTtoState = (slideID) => {
    const pptComp = this.pptMarkup(slideID);
    this.setState({ ppt: pptComp })
  }

  //return markup for iframe with new slide id in URL
  pptMarkup = (slideID) => {
    return (
      <iframe 
        src={{/* Removed due to contract */}}
        title='keyConceptSlides'
        allowFullScreen
        id='ppt-frame'
      />
    );
  }

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  render() {
    let filteredResults = this.state.concepts.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTER))

    return (
      <div className='container-fluid'>
        <div className="row">
          <div className="col-12 col-md-9 pageSection">
            <h1 className='pb-4'>Key Concepts</h1>
            <div id='ppt-container' className="embed-responsive embed-responsive-16by9">
              {this.state.ppt}
            </div>
          </div>
          <div id='key-concept-wrapper' className="col-12 col-md-3 prettifyScrollBar">
            <SearchInput className='mb-3' onChange={this.searchUpdated} placeholder='Search Concepts' />
            <ul id="key-concept-list">
              {filteredResults}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default KeyConcepts;