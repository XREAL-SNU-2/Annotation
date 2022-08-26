import React, { PureComponent, useEffect } from 'react';
import {
  useMoralis,
  useWeb3ExecuteFunction,
  useWeb3Transfer,
  useNewMoralisObject,
} from 'react-moralis';
import hash from 'object-hash';
import { HighlightArea } from '@react-pdf-viewer/highlight';
import { userInfo } from 'os';
import internal from 'stream';

export interface Receipt {
  noteHash: string;
  notePrice: number;
  noteWriterAddress: string;
  buyerAddress: string;
}

const updateNotePermission = async (
  Moralis: any,
  receipt: Receipt,
  receiptHash: string,
  setReload: any
) => {
  // console.log("UpdateUserPermission");
  const user = Moralis.User.current();
  // console.log(Moralis.User.current());
  const Note = Moralis.Object.extend('Notes');
  const userQuery = new Moralis.Query(Note);
  userQuery.equalTo('noteHash', receipt.noteHash);
  const result = await userQuery.find();
  const currentBuyers = result[0].get('buyers') as Array<string>;
  // console.log(currentBuyers);

  const username = user.get("username");
  currentBuyers.push(username);
  // console.log(currentBuyers);
  await result[0].set('buyers', currentBuyers);
  // console.log(result[0].get("buyers"));
  result[0].save().then(() => {
    setReload(true);
  });
};

const uploadNoteToContract = async (
  Moralis: any,
  contractProcessor: any,
  receipt: Receipt,
  receiptHash: string,
  setReload: any
) => {
  const web3 = await Moralis.enableWeb3();

  const options = {
    amount: Moralis.Units.Token(receipt.notePrice, 18),
    receiver: receipt.noteWriterAddress,
    type: 'erc20',
    contractAddress: '0x34Cf4076959f781c5b786ac1DC4dD9f0Fc7B39a9',
  };

  await contractProcessor.fetch({
    params: options,
    onSuccess: async () => {
      await updateNotePermission(Moralis, receipt, receiptHash, setReload)
    },
    onError: (error: any) => {
      alert(error);
    },
  });
};

export const buyNote = async (
  Moralis: any,
  contractProcessor: any,
  receipt: Receipt,
  setReload: any
) => {
  const user = Moralis.User.current();
  const transferHash = hash({
    noteHash: receipt.noteHash,
    notePrice: receipt.notePrice,
    noteWriterAddress: receipt.noteWriterAddress,
    buyerAddress: receipt.buyerAddress,
  });

  await uploadNoteToContract(Moralis, contractProcessor, receipt, transferHash, setReload);
};
