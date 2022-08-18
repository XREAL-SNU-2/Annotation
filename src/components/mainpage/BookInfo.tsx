import React, { PropsWithChildren } from 'react';
import './BookInfo.scss';
import {Link} from 'react-router-dom';
type book = {
  name: string;
};

const Bookinfo = ({ name }: book) => {
  return <div>
    THIS IS {name}
    <Link to='/pdfpage' state={{pdfName: name}}>
      <button>To PDF</button>
    </Link>
  </div>;
  
};

export default Bookinfo;
