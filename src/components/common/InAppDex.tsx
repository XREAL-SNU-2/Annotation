import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Icon, ConnectButton, Input } from 'web3uikit';
import { useMoralis } from 'react-moralis';

import './InAppDex.scss';

const InAppDex = () => {
  const { Moralis } = useMoralis();

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const onClickToggleModal = useCallback(async () => {
    setOpenModal(!isOpenModal);
  }, [isOpenModal]);

  const options = {
    contractAddress: '0xf14261853092780cEc284bc3acf2658a52A57A63',
    functionName: 'tokenToAnnoToken',
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_minTokens',
            type: 'uint256',
          },
        ],
        name: 'tokenToAnnoToken',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    Params: { _minTokens: '100' },
    msgValue: Moralis.Units.ETH(0.1),
  };
  const swap = async () => {
    const option = options;
    await window.location.reload();
  };
  return (
    <>
      <div className="dexContainer">
        <div className="dexTitle">Swap</div>
        <div className="swapBox">
          <div className="fromInfo">
            <div className="fromTokenName">ANNO</div>
            <div className="fromTokenBalance">Balance: 0.11111</div>
          </div>
          <div className="fromToken">
            <Input />
          </div>
          <img
            className="changeButton"
            src={require('../../images/logo.png')}
          />
          <div className="toInfo">
            <div className="toTokenName">MATIC</div>
            <div className="toTokenBalance">Balance: 0.22222</div>
          </div>
          <div className="toToken">
            <Input />
          </div>
          <div className="priceInfo">PRICE 0.315315 ANNO per MATIC</div>
          <button className="swapButton" onClick={swap}>
            swap
          </button>
        </div>
      </div>
    </>
  );
};

export default InAppDex;
