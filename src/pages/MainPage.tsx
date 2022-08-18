import React, {Dispatch, SetStateAction, Suspense} from 'react';
import { Link } from 'react-router-dom';
import { TextArea, Icon, Loading } from 'web3uikit';
import { useState, useEffect, useCallback } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import TopicList from '../components/mainpage/TopicList';
import BookList from '../components/mainpage/BookList';
import './MainPage.scss';


const Mainpage = () => {
  const { Moralis, account, isAuthenticated, user } = useMoralis();
  try {
    const user = Moralis.User.current();
  } catch (error) {
    <></>;
  }
  const [PDFArr, setPDFArr] = useState<any[]>();

  async function getPDFs() {
    try {
      const PDFs = Moralis.Object.extend('PDFs');
      const query = new Moralis.Query(PDFs);
      const results = await query.find();

      setPDFArr(results);
    } catch (error) {
      <></>;
    }
  }
  getPDFs();

  return (
    <>
      MAINPAGE
      <div className="mainpage">
        <div className="topicBox">
          <div className="topicHeader">Topic </div>
          <TopicList topics={['BlockChain', 'Math', 'Fine Art']} />
        </div>
        <div className="bookBox">
          {!PDFArr ? (
            <div>Loading...</div>
          ) : (
            // <div>Complete...</div>
            <BookList PDFArr={PDFArr ? PDFArr : ['EMPTY PDFARR']} />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Mainpage);
