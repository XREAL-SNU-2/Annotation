import React, { PureComponent } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import hash from 'object-hash';

function UpdatePDF() {
    const { Moralis } = useMoralis();
    const user = Moralis.User.current();
    const contractProcessor = useWeb3ExecuteFunction();
    const [noteDetail, setNoteDetail] = React.useState<string>();
    const [username, setUsername] = React.useState<string>();
    const [notePosition, setNotePosition] = React.useState<string>();
    const [noteGoods, setNoteGoods] = React.useState<number>();
    const [noteBads, setNoteBads] = React.useState<number>();
    const [notePrice, setNotePrice] = React.useState<number>();

    const [noteHash, setNoteHash] = React.useState<string>();

    const [error, setError] = React.useState<string>();

    React.useEffect(() => {
        setNoteHash(hash({"noteDetail": noteDetail, "username": username, "notePosition": notePosition }));
    }, [noteDetail, username, notePosition]);

    const uploadContract = async () => {
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
                noteDetail: noteDetail,
                noteHash: noteHash
            },
            msgValue: Moralis.Units.ETH(0.00001)
        }

        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                updatePDF();
            },
            onError: (error) => {
                setError(error.message);
            }
        })
    }

    const errorMessage = React.useMemo(() => {
        return (
            <div>{error}</div>
        )
    }, [error]);

    const updatePDF = async () => {
        const PDF = Moralis.Object.extend("PDFs");
        const queryOfPDF = new Moralis.Query(PDF);
        const selectedPDF = await queryOfPDF.containedIn("title", [
            "Mastering Ethereum"
        ]);
        const PDFDetails = await selectedPDF.first();
        let PDFNoteIds: string[] = PDFDetails?.get("noteIds");

        const Note = Moralis.Object.extend("Notes");
        const note = new Note();

        if(noteDetail) {
            note.set("noteDetail", noteDetail);
        }
        if(notePosition) {
            note.set("notePosition", notePosition);
        }
        if(noteGoods) {
            note.set("noteGoods", noteGoods);
        }
        if(noteBads) {
            note.set("noteBads", noteBads);
        }
        if(notePrice) {
            note.set("notePrice", notePrice);
        }
        if(noteHash) {
            note.set("noteHash", noteHash);
        }

        await note.save().then(async (savedNote: any) => {
            if(!PDFNoteIds) {
                PDFNoteIds = [savedNote.noteHash!];
            } else {
                PDFNoteIds = [...PDFNoteIds, savedNote.noteHash!];
            }
            PDFDetails?.set("noteIds", PDFNoteIds);

            await PDFDetails?.save();
        });
    }

    return (
        <>
            <div>noteDetail</div>
            <input value={noteDetail} onChange = {(e) => setNoteDetail(e.target.value)}></input>
            <div>username</div>
            <input value={username} onChange = {(e) => setUsername(e.target.value)}></input>
            <div>notePosition</div>
            <input value={notePosition} onChange = {(e) => setNotePosition(e.target.value)}></input>
            <div>noteGoods</div>
            <input value={noteGoods} onChange = {(e) => setNoteGoods(Number(e.target.value))}></input>
            <div>noteBads</div>
            <input value={noteBads} onChange = {(e) => setNoteBads(Number(e.target.value))}></input>
            <div>notePrice</div>
            <input value={notePrice} onChange = {(e) => setNotePrice(Number(e.target.value))}></input>
            {errorMessage}
            <button onClick={uploadContract}>save</button>
        </>
    )
}

export default UpdatePDF;