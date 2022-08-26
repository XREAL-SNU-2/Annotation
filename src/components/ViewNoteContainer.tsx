import MDEditor from '@uiw/react-md-editor';
import { getNote } from 'functions/uplaodNote';
import React, { PureComponent, useState } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { Note } from '../pages/PdfPage';

interface props {
    note: Note;
    notePropsCancel: any;
    setViewMode: any;
}

function ViewNoteContainer({note, notePropsCancel, setViewMode}: props) {
    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const user = Moralis.User.current();
    const [good, setGood] = React.useState<number>(note.good.length);
    const [bad, setBad] = React.useState<number>(note.bad.length);
    const [noteDetail, setNoteDetail] = React.useState<string>("");
    React.useEffect(() => {
      getNote(Moralis, contractProcessor, note.noteHash, setNoteDetail);
    }, []);
    const ViewNoteContainerByGetNote = React.useMemo(() => {
      if(note) {
        const username = user?.get("username");
        return (
          <>
            <div className="viewNoteContainer">
                <div className="label" style={{"backgroundColor": note.labelColor}}></div>
                <div className="author">
                  <text>Noted By {note?.author}</text>
                </div>
                <div className="title">{note.title}</div>
                <div className="detailContainer">
                  <MDEditor.Markdown
                    source={noteDetail}
                  />
                </div >
                <div className="goodBadContainer">
                  <div className="goodContainer">
                    <button className={"good" + (note.good.includes(username) ? " voted" : "")} onClick={async () => {
                      if(!note.good.includes(username) && !note.bad.includes(username)) {
                        const goodList = note.good;
                        goodList.push(username);
  
                        const notes = Moralis.Object.extend("Notes");
                        const query = new Moralis.Query(notes);
                        const _notesOfPDF = await query.equalTo("noteHash", note.noteHash);
                        const notesOfPDF = await _notesOfPDF.find();
                        const noteOfPDF = notesOfPDF[0];
  
                        noteOfPDF.set("noteGoods", goodList);
  
                        noteOfPDF.save();

                        setGood(good + 1);
                      }
                    }}>Good</button>
                    <div className="goods">{good}</div>
                  </div>
                  <div className="badContainer">
                    <button className={"bad" + (note.bad.includes(username) ? " voted" : "")} onClick={async () => {
                      if(!note.good.includes(username) && !note.bad.includes(username)) {
                        const badList = note.bad;
                        badList.push(username);
  
                        const notes = Moralis.Object.extend("Notes");
                        const query = new Moralis.Query(notes);
                        const _notesOfPDF = await query.equalTo("noteHash", note.noteHash);
                        const notesOfPDF = await _notesOfPDF.find();
                        const noteOfPDF = notesOfPDF[0];
  
                        noteOfPDF.set("noteBads", badList);
  
                        noteOfPDF.save();

                        setGood(bad + 1);
                      }
                    }}>Bad</button>
                    <div className="bads">{bad}</div>
                  </div>
                </div>
                <button className="cancel"
                  onClick={() => {
                    notePropsCancel;
                    setViewMode(false);
                  }}
                >{"<"}</button>
              </div>
            </>
        )
    } else {
      return (
          <>
          
          </>
      )
    }
    }, [noteDetail, note])

    return (
      <>
        {ViewNoteContainerByGetNote}
      </>
    )
}

export default ViewNoteContainer;