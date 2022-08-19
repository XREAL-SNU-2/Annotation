import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, ConnectButton, Input } from 'web3uikit';
import { useMoralis } from 'react-moralis';

import './InAppDex.scss';

const InAppDex = () => {
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
          <div className="swapButton">SWAP</div>
        </div>
      </div>
    </>
  );
};

export default InAppDex;
