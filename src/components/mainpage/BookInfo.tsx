import React, { PropsWithChildren } from 'react';
import './BookInfo.scss';
import { Link } from 'react-router-dom';
type book = {
  title: string;
  info: string;
  thumbnail: string;
};

const Bookinfo = ({ title, info, thumbnail }: book) => {
  return (
    <>
      <div className="pdfInfoContainer">
        <img src={thumbnail} className="pdfThumbnail" />
        <div className="pdfInfo">
          <div className="pdfTitle">{title}</div>
          <div className="pdfInfoText">{info}</div>
        </div>
      </div>
      <Link
        to="/pdfpage"
        state={{ pdfName: title }}
        className="buyPDFButtonContainer"
      >
        <div className="buyPDFButton">READ THIS</div>
      </Link>
    </>
  );
};

export default Bookinfo;
