import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

class ReactNavbar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  closeNav = () => {
    this.setState({ expanded: false })
  }

  render() {
    return (
      <Navbar 
        expand="lg" 
        sticky='top' 
        className='navbarWhite' 
        expanded={this.state.expanded} 
        onSelect={this.closeNav}
        onToggle={this.toggle}
      >
        <Navbar.Brand>
          <Link to='/'>
            <img
              src={/* Removed due to contract */}
              width="40"
              height="40"
              className="d-inline-block align-top"
              alt="OMA logo"
              onClick={this.closeNav}
            />
          </Link>
        </Navbar.Brand>
        <a
          href={/* Removed due to contract */}
          rel='noopener noreferrer'
          target='_blank'
          className='nav-link'
        >Roadmap</a>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link onClick={this.closeNav} className='nav-link' to="/archsupport">Architecture Support</Link>
            <Link onClick={this.closeNav} className='nav-link' to="/standards">Standards & Patterns</Link>
            <Link onClick={this.closeNav} className='nav-link' to="/career">Career Development</Link>
            <Link onClick={this.closeNav} className='nav-link' to="/training">Training Services</Link>
            <NavDropdown title="Community Services" id="comm-nav-dropdown">
              <LinkContainer onClick={this.closeNav} className='nav-link' to="/community/home">
                <NavDropdown.Item>
                  Community Home
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer onClick={this.closeNav} className='nav-link' to="/community/architects">
                <NavDropdown.Item>
                  Architects
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer onClick={this.closeNav} className='nav-link' to="/community/techconnect">
                <NavDropdown.Item>
                  techconnect
                </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        {/**
        <div id="user-info">
          {this.props.userInfo.account.name}
        </div>
         */}
      </Navbar>
    );
  }
}

export default ReactNavbar;