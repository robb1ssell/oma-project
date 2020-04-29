import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MoreButton extends Component {
  constructor(props) {
    super(props)

    this.goToPage = this.goToPage.bind(this);
  }

  goToPage = () => {
    window.location = this.props.page;
  }

  render() {
    return (
      <div className="moreBtn">
        <Link to={this.props.page}>
          <button 
            className={this.props.className} 
            disabled={this.props.disabled}
          >
            <span className="em-c-btn__text">Learn More</span>
          </button>
        </Link>
      </div>
    );
  }
}

export default MoreButton;