import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/MainPage';
import Header from 'components/common/Header';
import Uploadpage from 'pages/UploadPage';
import { useMoralis } from 'react-moralis';
import './App.scss';
import ProfilePage from 'pages/ProfilePage';
import UpdatePDF from 'components/UpdatePDF';

const App = () => {
  return (
    <>
      <div className="page">
        <div className="headerContainer">
          <Header />
        </div>
        <div className="mainWindow">
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upload" element={<Uploadpage />} />
            <Route path="/test/updatepdf" element= {<UpdatePDF></UpdatePDF>}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
