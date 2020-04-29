import React, { Component } from 'react';

class ContactCardListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      badges: [],
    }
  }

  componentDidMount = () => {
    this.setOpenCA();
  }

  //helper function to create markup for badge
  createBadge = (src) => {
    return <img key={src} src={src} alt='badge'/>;
  }

  //tests column info for content
  //sets appropriate source for img and sets it to state
  //callback is the next function down
  setOpenCA = () => {
    let src;
    if (this.props.openCA !== null && this.props.openCA !== 'None') {
      switch (this.props.openCA) {
        case 'Certified':
          src = {/* Removed due to contract */}
          break;
        case 'Master':
          src = {/* Removed due to contract */}
          break;
        case 'Distinguished':
          src = {/* Removed due to contract */}
          break;
        default:
          break;
      }
      let img = this.createBadge(src);
      this.setState({
        badges: [...this.state.badges, img]
      }, () => {
        this.setTogaf()
      })
    }
    else {
      this.setTogaf()
    }
  }

  //tests column info for content
  //sets appropriate source for img and sets it to state
  //callback is the next function down
  setTogaf = () => {
    let src;
    if (this.props.togCert !== null && this.props.togCert !== 'None') {
      switch (this.props.togCert) {
        case 'Foundation':
          src = {/* Removed due to contract */}
          break;
        case 'Certified':
          src = {/* Removed due to contract */}
          break;
        case 'Accredited':
          src = {/* Removed due to contract */}
          break;
        default:
          break;
      }
      let img = this.createBadge(src);
      this.setState({
        badges: [...this.state.badges, img]
      }, () => {
        this.setSafe()
      })
    }
    else {
      this.setSafe()
    }
  }

  //tests column info for content, the prop is boolean
  //sets appropriate source for img and sets it to state
  //callback is the next function down
  setSafe = () => {
    let src;
    if (this.props.safeCert) {
      src = {/* Removed due to contract */}
      let img = this.createBadge(src);

      this.setState({
        badges: [...this.state.badges, img]
      }, () => {
        this.setDama()
      })
    }
    else {
      this.setDama()
    }
  }

  setDama = () => {
    let src;
    if (this.props.damaCert !== null && this.props.damaCert !== 'None') {
      switch (this.props.damaCert) {
        case 'CDMP_Associate':
          src = {/* Removed due to contract */}
          break;
        case 'CDMP_Practitioner':
          src = {/* Removed due to contract */}
          break;
        case 'CDMP_Master':
          src = {/* Removed due to contract */}
          break;
        case 'CDMP_Fellow':
          src = {/* Removed due to contract */}
          break;
        default:
          break;
      }
      let img = this.createBadge(src);
      this.setState({
        badges: [...this.state.badges, img]
      })
    }
  }

  render() {
    return (
      <li className="em-c-contact-card-list__item em-l-grid__item">
        <div className="em-c-card vcard d-flex flex-column pt-3">
          <div className="contactBody">
            <div className='d-flex mt-auto contactName mb-2'>
              <div>
                <h4 className='pr-3 mb-0'>
                  {this.props.prefName ? this.props.prefName : this.props.firstName} {this.props.prefLastName ? this.props.prefLastName : this.props.lastName}
                </h4>
                <p className='acmDes mb-0'>{this.props.acmLevel}</p>
              </div>
              <div className="ml-auto">
                <a href={this.props.profileLink} className="" target='_blank' rel='noreferrer noopener'>
                  <img 
                    src={this.props.profilePicture}
                    ref={img => this.img = img}
                    alt=''
                    className='mySitePic'
                    onError={() => this.img.src = this.props.noPic}>
                  </img>
                </a>
              </div>
            </div>
            <p className="em-c-media-block__desc"><span className='role'>{this.props.archType}</span>
              <br /><span className='contactArea'>{this.props.area}</span></p>
            <p id='l2org' className='em-c-media-block__desc'>{this.props.l2org}</p>
            <p className="contactLocation mt-auto"><span>{this.props.officeLocation}</span></p>
          </div>
          <a href={this.props.acclaimLink}>
            <div id="cert-badges" className='d-flex pt-2 flex-wrap'>
              {this.state.badges}
            </div>
          </a>
        </div>
      </li>
    );
  }
}

export default ContactCardListItem;