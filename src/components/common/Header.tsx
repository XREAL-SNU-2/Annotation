import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Icon, ConnectButton } from 'web3uikit';
import { useMoralis } from 'react-moralis';
import DexModal from './DexModal';
import InAppDex from './InAppDex';
import './Header.scss';

const Header = () => {
  const { isAuthenticated, authenticate, Moralis } = useMoralis();
  const login = async () => {
    if (!isAuthenticated) {
      await authenticate().then(() => window.location.reload());
    }
  };

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const onClickToggleModal = useCallback(async () => {
    setOpenModal(!isOpenModal);
  }, [isOpenModal]);

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
              <div>
                {isOpenModal && (
                  <DexModal onClickToggleModal={onClickToggleModal}>
                    <InAppDex />
                  </DexModal>
                )}
              </div>
              <button className="buyTokenButton" onClick={onClickToggleModal}>
                Buy Anno Token
              </button>
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
