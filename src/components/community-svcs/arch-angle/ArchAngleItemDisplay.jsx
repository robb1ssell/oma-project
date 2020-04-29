import React, { Component } from 'react';
import { sp } from "@pnp/sp";
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment'
import { Link } from 'react-router-dom'
import UnityIconButton from '../../UnityIconButton';
//import SearchInput, { createFilter } from 'react-search-input';

//needed for SearchInput's createFilter
//search bar will only filter on props of card that are listed here
/**
 * 
 
const KEYS_TO_FILTERS = [
  'props.children[0].props.children.value',
  'props.children[1].props.children.props.children.props.children.props.children',
];
*/

class ArchAngleItemDisplay extends Component {
  constructor(props){
    super(props);

    this.state = {
      itemID: Number(props.match.params.id),
      currentItem: {Image: ''},
      archiveLength: null,
      searchTerm: '',
      archiveItems: [],
    }

    //this.itemRefs = [];
  }

  //If archiveLength hasn't been set, let's get the list length so we know when to hide the next item btn
  //otherwise, just query the single item needed
  componentDidMount = () => {
    document.title = 'OMA | Architect Angle Archive'
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    if (!this.state.archiveLength) {
      this.getListLength();
    }
    else {
      this.getItemInfo();
    }
  }

  //updates the page when user navigates between items
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.itemID !== this.state.itemID) {
      this.setState({ 
        itemID: this.state.itemID
      }, () => {
        if (!this.state.archiveLength) {
          this.getListLength();
        }
        else {
          this.getItemInfo();
        }
      })
    }
  }

  //Sets id of new item when change occurs to send correct id to componentDidUpdate
  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.match.params.id !== prevState.itemID) {
      return {itemID: Number(nextProps.match.params.id)};
    } 
    else return null;
  }

  getListLength = () => {
    sp.web.lists.getByTitle("OMA_Architects_Angle_Archive").items.get()
    .then((items) => {
      this.setState({ 
        archiveLength: items.length
      }, () => {
        this.getItemInfo();
      })
    });
  }

  getItemInfo = () => {
    sp.web.lists.getByTitle("OMA_Architects_Angle_Archive").items.filter("GivenID eq " + this.state.itemID + "'").get()
    .then((item) => {
      this.setState({ 
        currentItem: item[0],
      }, () => {
        this.getArchiveItems();
      })
    })
    .catch(err => {
      console.log('custom error catch' + err)
    })
  }

  //click handler for view content button. opens link to content in new tab.
  sendToContent = () => {
    if (this.state.currentItem.Link !== null) {
      window.open(this.state.currentItem.Link.Url, '_blank');
    }
  }

  navToItem = (direction) => {
    if (direction === 'Previous Item' && this.state.itemID !== 1) {
      this.props.history.push(`/community/AAArchive/display/${this.state.itemID - 1}`)
    }
    
    if (direction === 'Next Item' && this.state.itemID <= this.state.archiveLength) {
      this.props.history.push(`/community/AAArchive/display/${this.state.itemID + 1}`)
    }
  }

  switchContent = (e) => {
    let id = e.target.id;
    console.log(id)
  }

  //Creates markup for the archive list items in a nested format based on month of items
  getArchiveItems = () => {
    let navOptions = [];
    let uniqueMonths = [];

    sp.web.lists.getByTitle("OMA_Architects_Angle_Archive").items.get()
    .then(items => {
      let monthString = '';
      const sorted = items.sort((a, b) => a.GivenID - b.GivenID)
      //go through items and create list of unique months
      sorted.forEach(el => {
        monthString = moment(el.Date).format('MMMM YYYY');
        if (uniqueMonths.indexOf(monthString) === -1){
          uniqueMonths.unshift(monthString); //unshift is basically prepend, adds month to 0th index of array to create "latest first" order
        }
      })
      
      //for each month, go through the items and if the date matches, create a list item for it
      uniqueMonths.forEach(month => {
        let tempListItems = [];

        //let thisRef = this;
        items.forEach(item => {
          if (moment(item.Date).format('MMMM YYYY') === month) {
            tempListItems.unshift(
              <Link to={`/community/AAArchive/display/${item.GivenID}`} key={item.Title}>
                <li 
                  id={`archive-item-${item.GivenID}`}
                  className='sidePanel-link pointer hover-cyan'
                >
                  <span>{item.Title}</span>
                </li>
              </Link>
            )
          }
        })

        //each month will be a list item of the sidebar nav parent list
        //each piece of content for that month goes in a nested list
        navOptions.push(
          <li key={month} className='sidePanel-category'>
            <p className='bold'>{month}</p>
            <ul>
              {tempListItems}
            </ul>
          </li>
        )
      })

      this.setState({
        itemData: items,
        archiveItems: navOptions,
      }, () => {
        this.removeActiveClass();
        this.setActiveItem();
        this.fixImageUrls();
      });
    })
  }
  
  //replace localhost url for local testing
  fixImageUrls = () => {
    let images = [...document.querySelectorAll('#aaa-item-desc img')];
    images.forEach(el => {
      if (el.src.substr(0,22) === 'http://localhost:30662') {
        let part2 = el.src.substr(22);
        let part1 = {/* Removed due to contract */}

        el.src = `${part1}${part2}`;
      }
    })
  }

  /** 
  //helper method to create array of refs for archive items to be accessed to set active class when selected
  addItemRef = (node) => {
    this.itemRefs = [...this.itemRefs, node];
    console.log(this.itemRefs)
  }
  */

  //sets class on active item based on dynamically assigned state and url param
  //allows easier updating when changing items in multiple ways like we have
  setActiveItem = () => {
    document.querySelector(`#archive-item-${this.state.itemID}`).classList.add("sidePanel-active");
  }

  //remove active class before setting new active class
  removeActiveClass = () => {
    let actives = [...document.querySelectorAll('.sidePanel-active')];
    actives.forEach(el => {
      el.classList.remove("sidePanel-active");
    })
  }

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  render() {
    //let filteredResults = [];
    //filter on what is in the search bar
    //filteredResults = this.state.archiveItems.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

    return (
      <div className='container-fluid noGutter'>
        <div className="row pageHeaderBlueBG">
          <div className="em-c-page-header container whiteText">
            <h1 className="em-c-page-header__title">Architect's Angle Archive</h1>
            <p className='em-c-page-header__desc'>
              {/* Removed due to contract */}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-md-4 col-12 sidePanel">
                {/**
                <SearchInput onChange={this.searchUpdated} placeholder='Archive Item Search'/>
                */}
                <ul className='sidePanel-nav'>{this.state.archiveItems}</ul>
              </div>
              <div className="col-xl-6 col-md-6 col-12">
                <div id='aaa-item-desc' className="em-c-page-header showListBullets em-l-linelength-container em-c-text-passage">
                  <h2 className="em-c-page-header__title mt-1">
                    {this.state.currentItem ? this.state.currentItem.Title : ''}
                  </h2>
                  {this.state.currentItem ? ReactHtmlParser(this.state.currentItem.Desc) : ''}
                </div>
                <div className="flex justify-se align-items-center">
                  <p className='mb-0 bold'>{this.state.currentItem ? this.state.currentItem.ItemType : ''}</p>
                  { this.state.currentItem.ItemType !== 'None' ? 
                    <button onClick={this.sendToContent} className="em-c-btn em-c-btn--primary meetingBtn">
                      <span className="em-c-btn__text">View Content</span>
                    </button>
                    :
                    <button onClick={this.sendToContent} disabled className="em-c-btn em-c-btn--disabled meetingBtn">
                      <span className="em-c-btn__text">View Content</span>
                    </button>
                  }
                </div>
                <div className='d-flex flex-row mt-5 pt-5 em-c-btn-group'>
                  {(this.state.itemID === 1) ? '' : 
                    <UnityIconButton
                      text={'Previous Item'}
                      onClick={e => {this.navToItem(e.target.innerText)}}
                      svgName={'arrow-left'}
                    />
                  }
                  {(this.state.itemID === this.state.archiveLength) ? '' : 
                    <UnityIconButton
                      text={'Next Item'}
                      classes={'ml-auto'}
                      onClick={e => {this.navToItem(e.target.innerText)}}
                      svgName={'arrow-right'}
                      iconRight={true}
                    />
                  }
                </div>
              </div>
              <div className="col-xl-3 col-md-2 col-12 mt-1 pr-5">
                { this.state.currentItem ? 
                  <img src={this.state.currentItem.Image.Url} 
                        alt=""
                        className='centerImgs pad-top-20'/> : '' }
              </div>
            </div>
          </div>
        </div>
        <div className="btn-center-bottom">
          <Link to={`/community/home`}>
            <button className="em-c-btn em-c-btn--secondary">
              <span className="em-c-btn__text">Back to Community Home</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ArchAngleItemDisplay;