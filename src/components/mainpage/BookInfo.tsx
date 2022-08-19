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
      <div className="infoContainer">
        <img src={thumbnail} className="thumbnail" />
        <div className="info">
          <div className="title">{title}</div>
          <div className="infoText">{info}</div>
        </div>
      </div>

      <Link to="/pdfpage" state={{ pdfName: title }}>
        <div className="buyPDFButton">USE 15 TOKEN TO READ</div>
      </Link>
    </>
  );
};

export default Bookinfo;
