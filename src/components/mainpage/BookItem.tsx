import React from 'react';
import { useState, useCallback } from 'react';
import { Input } from 'web3uikit';
import BookInfo from './BookInfo';
import Modal from './Modal';
import './BookItem.scss';
type book = {
  title: string;
  info: string;
  thumbnail: string;
  writer: string;
};

const BookItem = ({ title, info, thumbnail, writer }: book) => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const onClickToggleModal = useCallback(async () => {
    setOpenModal(!isOpenModal);
  }, [isOpenModal]);

  return (
    <>
      <div>
        {isOpenModal && (
          <Modal onClickToggleModal={onClickToggleModal}>
            <BookInfo title={title} info={info} thumbnail={thumbnail} />
          </Modal>
        )}
      </div>
      <div className="dialogButton" onClick={onClickToggleModal}>
        <img className="bookCover" src={thumbnail} />
        <div className="bookName">{title}</div>
        <div className="writer">{writer}</div>
      </div>
    </>
  );
};

export default BookItem;
