import React, { PureComponent } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import hash from 'object-hash';

export interface Note {
    noteDetail: string;
    noteWriter: string;
    notePosition: string;
    noteGoods: number;
    noteBads: number;
    notePrice: number;
}

const updatePDF = async (Moralis: any, note: any, noteHash: string) => {
    const user = Moralis.User.current();
    const PDF = Moralis.Object.extend("PDFs");
    const queryOfPDF = new Moralis.Query(PDF);
    const selectedPDF = await queryOfPDF.containedIn("title", [
        "Mastering Ethereum"
    ]);
    const PDFDetails = await selectedPDF.first();
    let PDFNoteIds: string[] = PDFDetails?.get("noteIds");

    const Note = Moralis.Object.extend("Notes");
    const newNote = new Note();

    if(note) {
        newNote.set("noteDetail", note.noteDetail);
        newNote.set("notePosition", note.notePosition);
        newNote.set("noteGoods", note.noteGoods);
        newNote.set("noteBads", note.noteBads);
        newNote.set("notePrice", note.notePrice);
        newNote.set("noteHash", noteHash);
    }

    await newNote.save().then(async (savedNote: any) => {
        if(!PDFNoteIds) {
            PDFNoteIds = [savedNote.noteHash!];
        } else {
            PDFNoteIds = [...PDFNoteIds, savedNote.noteHash!];
        }
        PDFDetails?.set("noteIds", PDFNoteIds);

        await PDFDetails?.save();
    });
};

const uploadNoteToContract = async (Moralis: any, contractProcessor: any,note: Note, noteHash: string) => {
    // const [contractError, setContractError] = React.useState<string>();
    const web3 = await Moralis.enableWeb3();
    const options = {
        contractAddress: "0x2b13bF58F20eDa732837b5F06eA04eB9224730c7",
        functionName: "addNote",
        abi: [{
            "inputs": [
                {
                    "internalType": "string",
                    "name": "noteDetail",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "noteHash",
                    "type": "string"
                }
            ],
            "name": "addNote",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }],
        params: {
            noteDetail: note.noteDetail,
            noteHash: noteHash
        },
        msgValue: Moralis.Units.ETH(0.00001)
    }

    await contractProcessor.fetch({
        params: options,
        onSuccess: () => {
            updatePDF(Moralis, note, noteHash);
            alert("success");
        },
        onError: (error: any) => {
            alert(error);
        }
    })
};

export const uploadNote = (Moralis: any, contractProcessor: any, note: Note): void => {
    const user = Moralis.User.current();
    const noteHash = hash({"noteDetail": note.noteDetail, "noteWriter": note.noteWriter, "notePosition": note.notePosition });
    
    uploadNoteToContract(Moralis, contractProcessor, note, noteHash);
};