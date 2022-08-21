import React, { useState, useCallback } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Link } from 'react-router-dom';
import { useMoralis } from 'react-moralis';

import './InAppDex.scss';

const InAppDex = () => {
  const { Moralis } = useMoralis();

  const swap = async () => {
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
    await window.location.reload();
  };

  const getAmountOfTokens = async () => {
    const options = {
      contractAddress: '0xf14261853092780cEc284bc3acf2658a52A57A63',
      functionName: 'tokenToAnnoToken',
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'inputAmount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'inputReserve',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'outputReserve',
              type: 'uint256',
            },
          ],
          name: 'getAmountOfTokens',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'pure',
          type: 'function',
        },
      ],
    };
  };

  const [fromToken, setFromToken] = useState<string>();
  const [toToken, setToToken] = useState();

  const fromTokenChangeHandler = (text: string) => {
    setFromToken(text);
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
          <div className="tokenBox">
            <TextInput
              onChangeText={(text: string) => fromTokenChangeHandler(text)}
              style={{ textAlign: 'right' }}
            />
          </div>
          <img
            className="changeButton"
            src={require('../../images/logo.png')}
          />
          <div className="toInfo">
            <div className="toTokenName">MATIC</div>
            <div className="toTokenBalance">Balance: 0.22222</div>
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
          <button className="swapButton" onClick={swap}>
            swap
          </button>
        </div>
      </div>
    </>
  );
};

export default InAppDex;
