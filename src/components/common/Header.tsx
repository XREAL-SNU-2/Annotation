import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, ConnectButton } from 'web3uikit';
import { useMoralis } from 'react-moralis';
import './Header.scss';

const Header = () => {
  const { isAuthenticated, authenticate, Moralis } = useMoralis();
  const login = async () => {
    if (!isAuthenticated) {
      await authenticate().then(() => window.location.reload());
    }
  };

  return (
    <>
      <div className="header">
        <div className="logoContainer">
          <Link to="/">
            <img className="logo" src={require('../../images/logo.png')} />
          </Link>
        </div>
        <div className="menu">
          {!isAuthenticated ? (
            <div className="login" onClick={login}>
              Wallet Connect
            </div>
          ) : (
            <>
              <div
                className="buyTokenButton"
                onClick={() => {
                  <></>;
                }}
              >
                Buy Anno Token
              </div>
              <Link to="/profile">
                <div className="profile">
                  <img
                    className="profileImg"
                    src={require('../../images/profile.png')}
                  />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Header);
