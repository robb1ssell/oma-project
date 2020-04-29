import React from 'react';
import SearchInput from 'react-search-input'

const RFSearchbar = props => {
  return (
    <div className="col-12 mb-2">
      <SearchInput className="matchSelectHeight" onChange={props.setSearchTerm} />
    </div>
  );
};

export default RFSearchbar;