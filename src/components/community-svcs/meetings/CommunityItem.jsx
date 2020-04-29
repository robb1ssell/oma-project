import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CommContact from './CommContact';

class CommunityItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contacts: [],
    }
  }

  componentDidMount = () => {
    this.createContacts();
  }

  createContacts = () => {
    let contactsFromProps = [];

    this.props.contactList.forEach(el => {
      contactsFromProps.push(
        <CommContact
          key={el.email}
          contactName={el.name}
          profileLink={el.profile}
          profilePicture={el.pic}
          noPic={this.props.noPic}
          email={el.email}
          sip={el.sip}
        />
      );
    })
    this.setState({ contacts: contactsFromProps })
  }

  render() {
    return (
      <li className="em-c-tile-list__item em-l-grid__item">
        <div className="em-c-tile communityTile">
          <Link to={this.props.pathToPage}>
            <h5 className="">{this.props.title}</h5>
          </Link>
          <div className='flex flex-col'>
            {this.state.contacts}
          </div>
        </div>
      </li>
    );
  }
}

export default CommunityItem;