import React, { PropsWithChildren } from 'react';
import './BookInfo.scss';

type book = {
  title: string;
  info: string;
  thumbnail: string;
};

const Bookinfo = ({ title, info, thumbnail }: book) => {
  return (
    <>
      <div className="title">{title}</div>
      <div className="info">
        <img src={thumbnail} className="thumbnail" />
        <div className="infoText">{info}</div>
      </div>
      <div className="buyButton">Buy</div>
    </>
  );
};

export default Bookinfo;
