import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage';
import Profile from './pages/Profile';
import PdfPage from './pages/PdfPage';
import Header from './components/common/Header';
import Uploadpage from './pages/UploadPage';
import { useMoralis } from 'react-moralis';
import { ConnectButton, Icon } from 'web3uikit';
import './App.scss';
import ProfilePage from './pages/ProfilePage';
import UpdatePDF from './components/UpdatePDF';
import InAppDex from 'components/common/InAppDex';

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
            <Route path="/profile" element={<Profile />} />
            <Route path={`/pdfpage`} element={<PdfPage />} />
            <Route path="/dex" element={<InAppDex />} />
            <Route path="/upload" element={<Uploadpage />} />
            <Route
              path="/test/updatepdf"
              element={<UpdatePDF></UpdatePDF>}
            ></Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
