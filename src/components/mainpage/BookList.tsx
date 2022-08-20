import Moralis from 'moralis/types';
import React, { useEffect, useState } from 'react';
import { useMoralisQuery } from 'react-moralis';
import BookItem from './BookItem';
import './BookList.scss';

type pdfArr = {
  PDFArr: any[];
};

const BookList = ({ PDFArr }: pdfArr) => {
  // useEffect(() => {
  //   const getPDFs = async () => {
  //     try {
  //       const { fetch } = useMoralisQuery('PDFs');
  //       const PDFs = Moralis.Object.extend('PDFs');
  //       const query = new Moralis.Query(PDFs);
  //       const result;

  //       setPDFArr(results);
  //     } catch (error) {
  //       alert(error);
  //     }
  //   };
  //   getPDFs();
  // }, []);
  return (
    <>
      <div className="bookListContainer">
        {PDFArr?.map((e, index) => {
          return (
            <div className="bookWrapper" key={index}>
              <BookItem
                title={e.attributes.title}
                info={e.attributes.info}
                thumbnail={e.attributes.thumbnail}
                writer={e.attributes.writer}
              />
            </div>
          );
        })}

      </div>
    </>
  );
};

export default BookList;
