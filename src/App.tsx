import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage';
import Profile from './pages/Profile';
import PdfPage from 'pages/PdfPage';
import Header from 'components/common/Header';
import { useMoralis } from 'react-moralis';
import { ConnectButton, Icon } from 'web3uikit';
import './App.scss';
const App = () => {
  const { isAuthenticated, Moralis } = useMoralis();

  // console.log("App.js를 거친다");
  return (
    <>
      {isAuthenticated ? (
        <div className="page">
          <div className="headerContainer">
            <Header />
          </div>
          <div className="mainWindow">
            <Routes>
              <Route path="/" element={<Mainpage/>} />
              <Route path="/profile" element={<Profile/>}/>
              <Route path={`/pdfpage`} element={<PdfPage/>}/>
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
