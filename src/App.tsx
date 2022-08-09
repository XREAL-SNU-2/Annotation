import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage';
import Header from 'components/common/Header';
import { useMoralis } from 'react-moralis';
import { ConnectButton, Icon } from 'web3uikit';
import './App.scss';

const App = () => {
  const { isAuthenticated, Moralis } = useMoralis();

  return (
    <>
      {isAuthenticated ? (
        <div className="page">
          <div className="headerContainer">
            <Header />
          </div>
          <div className="mainWindow">
            <Routes>
              <Route path="/" element={<Mainpage />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="loginPage">
          <Icon fill="#ffffff" size={40} svg="twitter" />
          <ConnectButton />
        </div>
      )}
    </>
  );
};

export default App;
