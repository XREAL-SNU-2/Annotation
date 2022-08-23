import React, { PureComponent, useEffect } from 'react';
import { useMoralis, useWeb3ExecuteFunction, useWeb3Transfer, useNewMoralisObject } from 'react-moralis';
import hash from 'object-hash';
import { HighlightArea } from '@react-pdf-viewer/highlight';
import { userInfo } from 'os';
import internal from 'stream';

export interface Receipt {
    noteObjectId: string;
    notePrice: number;
    noteWriterAddress: string;
    buyerAddress: string;
}

const updateNotePermission = async (Moralis: any, receipt: Receipt, receiptHash: string) => {
    console.log("UpdateUserPermission");
    const user = Moralis.User.current();
    console.log(Moralis.User.current());
    const Note = Moralis.Object.extend("Notes");
    const userQuery = new Moralis.Query(Note);
    userQuery.equalTo("objectId", receipt.noteObjectId);
    const result = await userQuery.find();
    const currentBuyers = result[0].get("buyers") as Array<string>;
    console.log(currentBuyers);

    const userId = user.id;
    currentBuyers.push(userId);
    console.log(currentBuyers);
    await result[0].set("buyers", currentBuyers);
    console.log(result[0].get("buyers"));
    result[0].save();
};

const uploadNoteToContract = async (Moralis: any, contractProcessor: any, receipt: Receipt, receiptHash: string) => {
    const web3 = await Moralis.enableWeb3();
    console.log("uploadNoteToContract");
    
    /*const options = {
        contractAddress: "0x34Cf4076959f781c5b786ac1DC4dD9f0Fc7B39a9",
        functionName: "transferFrom",
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }],
        params: {
            from: receipt.buyerAddress,
            to: receipt.noteWriterAddress,
            amount: receipt.notePrice
        },
        msgValue: Moralis.Units.ETH(0.000001)
    }*/

    const options = {
        amount: Moralis.Units.Token(receipt.notePrice, 18),
        receiver: receipt.noteWriterAddress,
        type: "erc20",
        contractAddress: "0x34Cf4076959f781c5b786ac1DC4dD9f0Fc7B39a9",
    }

    await contractProcessor.fetch({
        params: options,
        onSuccess: () => {
            updateNotePermission(Moralis, receipt, receiptHash);
            alert("success");
        },
        onError: (error: any) => {
            alert(error);
        }
    })

};

export const buyNote = (Moralis: any, contractProcessor: any, receipt: Receipt): void => {
    const user = Moralis.User.current();
    const transferHash = hash({"noteObjectId": receipt.noteObjectId, "notePrice": receipt.notePrice, "noteWriterAddress": receipt.noteWriterAddress, "buyerAddress": receipt.buyerAddress});
    
    uploadNoteToContract(Moralis, contractProcessor, receipt, transferHash);
};