import React, { useState, useCallback, useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Link } from 'react-router-dom';
import { useMoralis } from 'react-moralis';

import './InAppDex.scss';
import { string32 } from 'pdfjs-dist/types/src/shared/util';

const InAppDex = () => {
  const { isAuthenticated, Moralis, user } = useMoralis();
  const usrAddress = user?.attributes.ethAddress;
  const [fromToken, setFromToken] = useState<string>();
  const [toToken, setToToken] = useState();
  const [fromTokenBalance, setFromTokenBalance] = useState<number>(1);
  const [toTokenBalance, setToTokenBalance] = useState<number>(0.1);
  const [fromTokenName, setFromTokenName] = useState<string>('ANNO');
  const [toTokenName, setToTokenName] = useState<string>('MATIC');
  useEffect(() => {
    alert(usrAddress);
  });
  const fromTokenChangeHandler = (text: string) => {
    setFromToken(text);
  };

  // useEffect(() => {
  //   setFromTokenName('ANNO');
  //   setToTokenName('MATIC');
  // });

  const fromToChange = () => {
    const tempName = fromTokenName;
    setFromTokenName(toTokenName);
    setToTokenName(tempName);
    const tempBalance = fromTokenBalance;
    setFromTokenBalance(toTokenBalance);
    setToTokenBalance(tempBalance);
  };

  return (
    <>
      <div className="dexContainer">
        <div className="dexTitle">Swap</div>
        <div className="swapBox">
          <div className="lpTokenInfo">
            <div className="fromTokenName">{fromTokenName}</div>
            <div className="fromTokenBalance">Balance: {fromTokenBalance}</div>
          </div>
          <div className="tokenBox">
            <TextInput
              onChangeText={(text: string) => fromTokenChangeHandler(text)}
              style={{ textAlign: 'right' }}
            />
          </div>
          <button className="changeButton">
            <img
              className="changeButtonImage"
              src={require('../../images/swap_arrow.png')}
              onClick={fromToChange}
            />
          </button>
          <div className="lpTokenInfo">
            <div className="toTokenName">{toTokenName}</div>
            <div className="toTokenBalance">Balance: {toTokenBalance}</div>
          </div>
          <div className="tokenBox">
            <View
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <Text style={{ textAlign: 'right' }}>{fromToken}</Text>
            </View>
          </div>
          <div className="priceInfo">PRICE 0.315315 ANNO per MATIC</div>
          <button className="swapButton">swap</button>
        </div>
      </div>
    </>
  );
};

export default InAppDex;
