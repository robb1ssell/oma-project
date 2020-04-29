import React, { Component } from 'react';
import CountUp from 'react-countup';

class ArchCountBox extends Component {
  render() {
    return (
      <div 
        id={this.props.id}
        onClick={this.props.clickHandler}
        className="col-12 em-c-tile pointer archTypeCount"
        archtype={this.props.archType}
      >
        <span className="em-c-tile__desc noClick"><h6>{this.props.archType}</h6></span>
        <div className="ml-auto counter centerText noClick">
          <CountUp end={this.props.end} duration={5}/>
        </div>
      </div>
    );
  }
}

export default ArchCountBox;