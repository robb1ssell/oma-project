import React from 'react';
import SearchInput from 'react-search-input'

const RFfilters = props => {
  return (
    <div id='emaf-filters' className="">
      <div className="col-12 mb-2">
        <SearchInput className="matchSelectHeight" onChange={props.setSearchTerm} />
      </div>
      <div id='rf-dropdowns' className="col-12 d-flex flex-wrap">
        <select 
          name="type-select"
          id="type-select"
          value={props.typeFilter}
          onChange={e => props.handleTypeSelect(e)}
          className='em-c-select'
        >
          <option value="">Architecture Type</option>
          {
            props.archTypeOptions.map(el => (
              <option key={el} value={el}>
                {el === 'RM' ? 'Reference Model' : el === 'RA' ? 'Reference Architecture' : 'Reference Implementation'}
              </option>
            ))
          }
        </select>
        <select 
          name="category-select"
          id="category-select"
          value={props.categoryFilter}
          onChange={e => props.handleCategorySelect(e)}
          className='em-c-select'
        >
          <option value="">Category</option>
          {
            props.categoryOptions.map(el => (
              <option key={el} value={el}>{el}</option>
            ))
          }
        </select>
      </div>
    </div>
  );
};

export default RFfilters;