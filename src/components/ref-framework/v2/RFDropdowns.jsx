import React from 'react';

const RFDropdowns = props => {
  return (
    <div id='rf-dropdowns' className="d-flex flex-wrap">
      <select 
        name="type-select"
        id="type-select"
        value={props.typeFilter}
        onChange={e => props.handleTypeSelect(e)}
        className='em-c-select capitalize'
      >
        <option value="">Architecture Type</option>
        {
          props.archTypeOptions.map(el => (
            <option key={el} value={el}>{el}</option>
          ))
        }
      </select>
      <select 
        name="category-select"
        id="category-select"
        value={props.categoryFilter}
        onChange={e => props.handleCategorySelect(e)}
        className='em-c-select capitalize'
      >
        <option value="">Category</option>
        {
          props.categoryOptions.map(el => (
            <option key={el} value={el}>{el}</option>
          ))
        }
      </select>
    </div>
  );
};

export default RFDropdowns;