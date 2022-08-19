import React, { PropsWithChildren } from 'react';
import './DexModal.scss';

interface ModalDefaultType {
  onClickToggleModal: () => void;
}

const DexModal = ({
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

export default DexModal;
