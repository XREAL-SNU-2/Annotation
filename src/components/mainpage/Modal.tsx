import React, { PropsWithChildren } from 'react';
import './Modal.scss';

interface ModalDefaultType {
  onClickToggleModal: () => void;
}

const Bookinfo = ({
  onClickToggleModal,
  children,
}: PropsWithChildren<ModalDefaultType>) => {
  return (
    <div className="modalContainer">
      <div className="dialogBox">{children}</div>
      <div
        className="backdrop"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();

          if (onClickToggleModal) {
            onClickToggleModal();
          }
        }}
      />
    </div>
  );
};

export default Bookinfo;
