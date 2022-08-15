import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage';
import Header from 'components/common/Header';
import Uploadpage from 'pages/UploadPage';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { ConnectButton, Icon } from 'web3uikit';
import './App.scss';

const App = () => {
  const { isAuthenticated, Moralis } = useMoralis();
  return (
    <>
      <div className="page">
        <div className="headerContainer">
          <Header />
        </div>
        <div className="mainWindow">
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/upload" element={<Uploadpage />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
