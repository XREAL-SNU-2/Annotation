import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="logo">
          <Link to="/">ANNOTATION</Link>
        </div>
        <div className="menu">
          <Link to="/profile">
            <div className="profile">
              <img
                className="profileImg"
                src={require('../../images/profile.png')}
              />
              <div className="profileName">name</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
