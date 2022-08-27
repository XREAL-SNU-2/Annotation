import MDEditor from '@uiw/react-md-editor';
import { Note } from 'pages/PdfPage';
import React, { PureComponent } from 'react';
import { useMoralis, useWeb3Transfer } from 'react-moralis';
import hash from 'object-hash';
import { buyNote } from 'functions/buyNote';

interface props {
  notes: Note[];
  jumpToHighlightArea: any;
  setViewMode: any;
  setSelectedNote: any;
  userEthAddress: string;
  setReload: any;
  currentPage: number;
}

function WrittenNoteContainer({
  notes,
  jumpToHighlightArea,
  setViewMode,
  setSelectedNote,
  userEthAddress,
  setReload,
  currentPage,
}: props) {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const transferProcessor = useWeb3Transfer();
  const currentNote = notes.filter(note => {
    return (
      note.highlightAreas[0].pageIndex === currentPage ||
      note.highlightAreas[0].pageIndex === currentPage - 1 ||
      note.highlightAreas[0].pageIndex === currentPage + 1
    );
  });
  return (
    <>
      {currentNote.length === 0 && <div>There is no note</div>}
      {currentNote.map(note => {
        const good = note.good.length;
        const bad = note.bad.length;
        return (
          <div
            key={note.id}
            className="note-box"
            style={{
              cursor: 'pointer',
            }}
          >
            <div className="note-content">
              <div
                // Jump to the associated highlight area
                onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
              >
                <div
                  className="label"
                  style={{ backgroundColor: note.labelColor }}
                ></div>
                <text className="note-authorName">Noted by {note.author}</text>
                <div className="title">{note.title}</div>
                <div className="detail">
                  <MDEditor.Markdown
                    source={note.content.substring(0, 200) + '...'}
                    style={{ backgroundColor: '#FFFFFF', height: 120 }}
                  />
                </div>
              </div>
              <div className="informationContainer">
                <div className="goodBad">
                  <text className="note-boldword">Good</text>
                  <text className="note-mideumword">{good}</text>
                  <text
                    className="note-boldword"
                    style={{ marginLeft: '51px' }}
                  >
                    Bad
                  </text>
                  <text className="note-mideumword">{bad}</text>
                </div>
                {note.buyers.includes(user?.get('username')) ? (
                  <button
                    className="buy-button"
                    onClick={() => {
                      setViewMode(true);
                      setSelectedNote(note);
                      jumpToHighlightArea(note.highlightAreas[0]);
                    }}
                  >
                    VIEW NOTE
                  </button>
                ) : (
                  <button
                    className="buy-button"
                    onClick={async () => {
                      // console.log("Btn Clicked");
                      const selectedNote = Moralis.Object.extend('Notes');
                      const currentNoteHash = note.noteHash;
                      //console.log(currentNoteHash);
                      // console.log(currentNoteHash);
                      const noteQuery = new Moralis.Query(selectedNote);
                      noteQuery.equalTo('noteHash', currentNoteHash);
                      const results = await noteQuery.find();
                      // console.log(results[0]);
                      const noteWriterEthAddress =
                        results[0].get('noteWriterAddress');
                      const noteHash = results[0].get('noteHash');
                      // console.log(noteId);
                      // console.log(noteWriterEthAddress);
                      //const writerAddress = results[0].get("ethAddress");
                      //console.log(writerAddress);
                      //const buyerAddress = Moralis.User.current()?.get("ethAddress");
                      await buyNote(
                        Moralis,
                        transferProcessor,
                        {
                          noteHash: noteHash,
                          notePrice: note.price,
                          noteWriterAddress: noteWriterEthAddress,
                          buyerAddress: userEthAddress,
                        },
                        setReload,
                      );
                    }}
                  >
                    USE {note.price} TOKEN TO READ
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default WrittenNoteContainer;
