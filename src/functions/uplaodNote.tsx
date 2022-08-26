import React, { PureComponent } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import hash from 'object-hash';
import { HighlightArea } from '@react-pdf-viewer/highlight';

export interface Note {
    noteTitle: string;
    noteDetail: string;
    noteWriter: string;
    noteWriterAddress: string;
    notePosition: HighlightArea[];
    noteGoods: string[];
    noteBads: string[];
    notePrice: number;
    pdfFileName: string;
    noteSelectedText: string;
    buyers: string[];
    labelColor: string;
    writerAddress: string;
}

export interface NoteInformation {
    noteTitle: string;
    noteDetail: string;
    noteWriter: string;
    noteWriterAddress: string;
    notePosition: HighlightArea[];
    notePrice: number;
    pdfFileName: string;
    noteSelectedText: string;
    labelColor: string;
    writerAddress: string;
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
        newNote.set("noteTitle", note.noteTitle);
        newNote.set("noteDetail", note.noteDetail.substring(0, 200));
        newNote.set("notePosition", note.notePosition);
        newNote.set("noteGoods", note.noteGoods);
        newNote.set("noteBads", note.noteBads);
        newNote.set("notePrice", note.notePrice);
        newNote.set("noteHash", noteHash);
        newNote.set("buyers", []);
        newNote.set("pdfFileName", note.pdfFileName);
        newNote.set("noteSelectedText", note.noteSelectedText);
        newNote.set("noteWriter", note.noteWriter);
        newNote.set("noteWriterAddress", note.noteWriterAddress);
        newNote.set("labelColor", note.labelColor);
        newNote.set("noteWriterAddress", note.writerAddress)
    }

    await newNote.save().then(async (savedNote: any) => {
        if(!PDFNoteIds) {
            PDFNoteIds = [noteHash!];
        } else {
            PDFNoteIds = [...PDFNoteIds, noteHash!];
        }
        PDFDetails?.set("noteIds", PDFNoteIds);
        
        await PDFDetails?.save();
    });
};

const uploadNoteToContract = async (Moralis: any, contractProcessor: any, note: any, noteHash: string) => {
    // const [contractError, setContractError] = React.useState<string>();
    const web3 = await Moralis.enableWeb3();
    const options = {
        contractAddress: "0xbE553a3824E24D606DcD2E9fe19B2A376a286297",
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

export const getNote = async (Moralis: any, contractProcessor: any, noteHash: string, setNoteDetail: any) => {
    const web3 = await Moralis.enableWeb3();
    await Moralis.authenticate();
    const options = {
        contractAddress: "0xbE553a3824E24D606DcD2E9fe19B2A376a286297",
        functionName: "getNote",
        abi: [{
            "inputs": [
                {
                    "internalType": "string",
                    "name": "noteHash",
                    "type": "string"
                }
            ],
            "name": "getNote",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        params: {
            noteHash: noteHash
        },
    }

    await contractProcessor.fetch({
        params: options,
        onSuccess: (noteDetail: any) => {
            setNoteDetail(noteDetail);
            alert("good");
        },
        onError: (error: any) => {
            alert(error);
        }
    })
}

export const uploadNote = (Moralis: any, contractProcessor: any, noteInformation: NoteInformation): void => {
    const user = Moralis.User.current();
    const noteHash = hash({"noteDetail": noteInformation.noteDetail, "noteWriter": noteInformation.noteWriter, "notePosition": noteInformation.notePosition });
    const note: Note = {
        noteTitle: noteInformation.noteTitle,
        noteDetail: noteInformation.noteDetail,
        noteWriter: noteInformation.noteWriter,
        noteWriterAddress: noteInformation.noteWriterAddress,
        notePosition: noteInformation.notePosition,
        noteGoods: [],
        noteBads: [],
        notePrice: noteInformation.notePrice,
        pdfFileName: noteInformation.pdfFileName,
        noteSelectedText: noteInformation.noteSelectedText,
        buyers: [],
        labelColor: noteInformation.labelColor,
        writerAddress: noteInformation.writerAddress
    }
    
    uploadNoteToContract(Moralis, contractProcessor, note, noteHash);
};