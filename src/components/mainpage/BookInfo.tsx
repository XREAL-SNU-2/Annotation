import React, { PropsWithChildren } from 'react';
import './BookInfo.scss';

type book = {
  name: string;
};

const Bookinfo = ({ name }: book) => {
  return <div>THIS IS {name}</div>;
};

export default Bookinfo;
