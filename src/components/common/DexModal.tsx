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
    <div className="dexModalContainer">
      <div className="dexDialogBox">{children}</div>
      <div
        className="dexBackdrop"
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
