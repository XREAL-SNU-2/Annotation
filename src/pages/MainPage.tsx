import React, {Dispatch, SetStateAction} from 'react';
import { Link } from 'react-router-dom';
import { TextArea, Icon } from 'web3uikit';
import { useState, useCallback } from 'react';
import TopicList from '../components/mainpage/TopicList';
import BookList from '../components/mainpage/BookList';
import './MainPage.scss';


const Mainpage = () => {
  return (
    <>
      MAINPAGE
      <div className="mainpage">
        <div className="topicBox">
          <TopicList />
        </div>
        <div className="bookBox">
          <BookList />
        </div>
      </div>
    </>
  );
};

export default Mainpage;
