import React from 'react';
import { useState, useCallback } from 'react';
import { Input } from 'web3uikit';
import BookInfo from './BookInfo';
import Modal from './Modal';
import './BookItem.scss';

type book = {
  name: string;
};

const BookItem = ({ name }: book) => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const onClickToggleModal = useCallback(() => {
    setOpenModal(!isOpenModal);
  }, [isOpenModal]);
  return (
    <>
      <div>
        {isOpenModal && (
          <Modal onClickToggleModal={onClickToggleModal}>
            <BookInfo name={name} />
          </Modal>
        )}
      </div>
      <div className="dialogButton" onClick={onClickToggleModal}>
        <img
          className="bookCover"
          src="https://github.com/XREAL-SNU-2/Annotation/blob/mainpage_sb/src/images/bookcover.png"
        />
        <div className="bookName">{name}</div>
      </div>
    </>
  );
};

export default BookItem;
