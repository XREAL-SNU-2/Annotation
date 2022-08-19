import React, { PureComponent } from 'react';
import { useMoralis } from 'react-moralis';

function UpdatePDF() {
    const { Moralis } = useMoralis();
    const [noteDetail, setNoteDetail] = React.useState<string>();
    const [username, setUsername] = React.useState<string>();
    const [notePosition, setNotePosition] = React.useState<string>();
    const [noteGoods, setNoteGoods] = React.useState<number>();
    const [noteBads, setNoteBads] = React.useState<number>();
    const [notePrice, setNotePrice] = React.useState<number>();


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

        await note.save().then(async (savedNote: any) => {
            if(!PDFNoteIds) {
                PDFNoteIds = [savedNote.id!];
            } else {
                PDFNoteIds = [...PDFNoteIds, savedNote.id!];
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
            <button onClick={updatePDF}>save</button>
        </>
    )
}

export default UpdatePDF;