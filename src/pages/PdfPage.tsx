import * as React from 'react';
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightsProps,
  RenderHighlightTargetProps,
} from '@react-pdf-viewer/highlight';
import {
  Button,
  Position,
  PrimaryButton,
  Tooltip,
  Viewer,
  Worker,
} from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PostingWritingPage from '../components/mainpage/PostWritingPage';
import MDEditor from '@uiw/react-md-editor';
import './PdfPage.scss';
import { Input } from 'web3uikit';
import {
  useMoralis,
  useWeb3ExecuteFunction,
  useWeb3Transfer,
} from 'react-moralis';
import { useLocation } from 'react-router-dom';
import { uploadNote } from '../functions/uplaodNote';
import { buyNote } from '../functions/buyNote';
import hash from 'object-hash';
interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
  price: number;
  good: number;
  bad: number;
  author: string;
  noteHash: string;
  buyers: string[];
}

interface CustomizedState {
  pdfName: string;
}

const PdfPage = () => {
  const [message, setMessage] = React.useState('');
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [writingMode, setWritingMode] = React.useState<boolean>(false);
  const [noteValue, setNoteValue] = React.useState<string>('');
  const [notePrice, setNotePrice] = React.useState<number>(0);
  const [userName, setUserName] = React.useState<string>('');
  const [pdffileUrl, setPdfFileUrl] = React.useState<string>(
    'https://ipfs.io/ipfs/QmbXiqFbSBqikhNLLb5vKCHpyegcXTJ7g4wpBc1UqTGM3g?filename=session%20messenger.pdf',
  );
  //기본 pdf로 아무거나 넣어둔 건데 이걸 백서로 바꿔보면 어떨까 싶음.
  const location = useLocation();
  const [notePropsHighLightArea, setNotePropsHighLightArea] =
    React.useState<any>();
  const [notePropsSelectedText, setNotePropsSelectedText] =
    React.useState<any>();
  const [notePropsCancel, setNotePropsCancel] = React.useState<any>();
  const [noteAuthor, setNoteAuthor] = React.useState<string>('');
  const pdfFileName = (location.state as CustomizedState).pdfName;
  const { Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const transferProcessor = useWeb3Transfer();
  Moralis.start({
    appId: 'rMCHTBGYR9zSvyLy9AhXq943Kkq1u7ADKoZjOLIs',
    serverUrl: 'https://frer4xw5obeo.usemoralis.com:2053/server',
  });
  const user = Moralis.User.current();
  const [userEthAddress, setUserEthAddress] = React.useState<string>('');

  React.useEffect(() => {
    async function getPDF() {
      try {
        const pdfs = Moralis.Object.extend('PDFs');
        const query = new Moralis.Query(pdfs);
        // console.log(pdfFileName+"this is pdf name");
        query.equalTo('title', pdfFileName);
        const results = await query.find();

        setPdfFileUrl(results[0].get('PDFFile'));
      } catch (error) {
        // console.error(error);
      }
    }

    const getNotes = async () => {
      const notes = Moralis.Object.extend('Notes');
      const query = new Moralis.Query(notes);
      const _notesOfPDF = await query.equalTo('pdfFileName', pdfFileName);
      const notesOfPDF = await _notesOfPDF.find();

      const noteList: Note[] = [];
      notesOfPDF.map((note: any, key: number) => {
        const newNote = {
          id: key,
          content: note.get('noteDetail'), //note.content = noteDetail
          highlightAreas: note.get('notePosition'),
          quote: note.get('noteSelectedText'),
          price: note.get('notePrice'),
          good: note.get('noteGoods'),
          bad: note.get('noteBads'),
          author: note.get('noteWriter'),
          noteHash: note.get('noteHash'),
          buyers: note.get('buyers'),
        };
        noteList.push(newNote);
      });

      setNotes(noteList);
    };

    const getUserAddress = async () => {
      const userObject = Moralis.Object.extend('_User');
      const userQuery = new Moralis.Query(userObject);
      const currentUserId = user?.id;
      userQuery.equalTo('objectId', currentUserId);
      const result = await userQuery.find();
      // console.log(result[0].get("ethAddress"));
      setUserEthAddress(result[0].get('ethAddress'));
    };

    getPDF();
    getNotes();
    setUserName(user?.get('name'));
    getUserAddress();
  }, []);

  let noteId = notes.length;

  const noteEles: Map<number, HTMLElement> = new Map();

  const OnWritingMode = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setWritingMode(true);
  };
  const OnReadingMode = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setWritingMode(false);
  };

  const OnPriceValueChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
    setNotePrice(event?.target.value as unknown as number);
  };

  const OnAuthorValueChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event?.target.value as string);
  };

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      className="addNoteButton"
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            onClick={() => {
              props.toggle();
              setWritingMode(true);
            }}
          >
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    //We Should write author, price,
    setNotePropsHighLightArea(props.highlightAreas);
    setNotePropsSelectedText(props.selectedText);
    setNotePropsCancel(props.cancel);
    const addNote = () => {
      if (noteValue !== '') {
        const note: Note = {
          id: ++noteId,
          content: noteValue,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
          price: notePrice,
          good: 0,
          bad: 0,
          author: userName,
          noteHash: '',
          buyers: [],
        };
        setNotes(notes.concat([note]));
        props.cancel();
      }
    };
    return (
      <div
        className="writeNoteContainer"
        style={{
          background: '#fff',
          border: '1px solid rgba(0, 0, 0, .3)',
          borderRadius: '2px',
          padding: '8px',
          position: 'absolute',
          left: `${props.selectionRegion.left * 0.7}%`,
          top: `${
            (props.selectionRegion.top + props.selectionRegion.height) * 0.5
          }%`,
          width: 450,
          height: 600,
          zIndex: 1,
        }}
      >
        <div>
          Noted by{' '}
          <input placeholder="Name" onChange={OnAuthorValueChange}></input>
        </div>
        <div>
          Price is{' '}
          <input
            onChange={OnPriceValueChange}
            placeholder="0"
            type="number"
          ></input>{' '}
          Anno token
        </div>
        <div>
          <PostingWritingPage setPostValue={setNoteValue}></PostingWritingPage>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '8px',
          }}
        >
          <div style={{ marginRight: '8px' }}>
            <PrimaryButton onClick={addNote}>Post</PrimaryButton>
          </div>
          <Button onClick={props.cancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  const addNote = (highlightAreas: any, selectedText: any, cancel: any) => {
    if (noteValue !== '') {
      const note: Note = {
        id: ++noteId,
        content: noteValue,
        highlightAreas: highlightAreas,
        quote: selectedText,
        price: notePrice,
        good: 0,
        bad: 0,
        author: userName,
        noteHash: '',
        buyers: [],
      };
      setNotes(notes.concat([note]));
      cancel;
    }
  };

  const writeNoteContainer = React.useMemo(() => {
    return (
      <>
        <div className="writeNoteContainer">
          <div>
            <text>Noted By </text>
            <input value={userName}></input>
          </div>
          <div>
            <text>가격: </text>
            <input
              value={notePrice}
              onChange={e => {
                setNotePrice(Number(e.target.value));
              }}
            ></input>
          </div>
          <div>
            <PostingWritingPage
              setPostValue={setNoteValue}
            ></PostingWritingPage>
          </div>
          <button
            onClick={() => {
              addNote(
                notePropsHighLightArea,
                notePropsSelectedText,
                notePropsCancel,
              );
              uploadNote(Moralis, contractProcessor, {
                noteDetail: noteValue,
                noteWriter: userName,
                noteWriterAddress: userEthAddress,
                notePosition: notePropsHighLightArea,
                notePrice: notePrice,
                pdfFileName: pdfFileName,
                noteSelectedText: notePropsSelectedText,
              });
              setWritingMode(false);
            }}
          >
            업로드
          </button>
          <button
            onClick={() => {
              notePropsCancel;
              setWritingMode(false);
            }}
          >
            취소
          </button>
        </div>
      </>
    );
  }, [
    notePropsHighLightArea,
    notePropsSelectedText,
    notePropsCancel,
    noteValue,
    notePrice,
    userName,
  ]);

  const writtenNoteContainer = React.useMemo(() => {
    return (
      <>
        {notes.length === 0 && <div>There is no note</div>}
        {notes.map(note => {
          if (note.buyers.includes(user?.id as string)) {
            return (
              <div
                key={note.id}
                className="note-box"
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <div className="note-content">
                  <div
                    // Jump to the associated highlight area
                    onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                  >
                    <blockquote
                      style={{
                        borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                        fontSize: '.75rem',
                        lineHeight: 1.5,
                        margin: '0px 0px 8px 0px',
                        paddingLeft: '8px',
                        textAlign: 'justify',
                      }}
                    >
                      {note.quote.substring(0, 45)}
                      <text className="note-authorName">
                        Noted by {note.author}
                      </text>
                    </blockquote>
                    <div>
                      <MDEditor.Markdown
                        source={note.content.substring(0, 200)}
                        style={{ backgroundColor: '#FFFFFF', height: 190 }}
                      />
                    </div>
                  </div>
                  <text className="note-boldword">Good</text>
                  <text className="note-mideumword">{note.good}</text>
                  <text className="note-boldword">Bad</text>
                  <text className="note-mideumword">{note.bad}</text>
                  <button className="buy-button">View Note</button>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={note.id}
                className="note-box"
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <div className="note-content">
                  <div
                    // Jump to the associated highlight area
                    onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                  >
                    <blockquote
                      style={{
                        borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                        fontSize: '.75rem',
                        lineHeight: 1.5,
                        margin: '0px 0px 8px 0px',
                        paddingLeft: '8px',
                        textAlign: 'justify',
                      }}
                    >
                      {note.quote.substring(0, 45)}
                      <text className="note-authorName">
                        Noted by {note.author}
                      </text>
                    </blockquote>
                    <div>
                      <MDEditor.Markdown
                        source={note.content.substring(0, 200)}
                        style={{ backgroundColor: '#FFFFFF', height: 190 }}
                      />
                    </div>
                  </div>
                  <text className="note-boldword">Good</text>
                  <text className="note-mideumword">{note.good}</text>
                  <text className="note-boldword">Bad</text>
                  <text className="note-mideumword">{note.bad}</text>
                  <button
                    className="buy-button"
                    onClick={async () => {
                      // console.log("Btn Clicked");
                      const selectedNote = Moralis.Object.extend('Notes');
                      const currentNoteHash = hash({
                        noteDetail: note.content,
                        noteWriter: note.author,
                        notePosition: note.highlightAreas,
                      });
                      //console.log(currentNoteHash);
                      // console.log(currentNoteHash);
                      const noteQuery = new Moralis.Query(selectedNote);
                      noteQuery.equalTo('noteHash', currentNoteHash);
                      const results = await noteQuery.find();
                      // console.log(results[0]);
                      const noteWriterEthAddress =
                        results[0].get('noteWriterAddress');
                      const noteId = results[0].id;
                      // console.log(noteId);
                      // console.log(noteWriterEthAddress);
                      //const writerAddress = results[0].get("ethAddress");
                      //console.log(writerAddress);
                      //const buyerAddress = Moralis.User.current()?.get("ethAddress");
                      buyNote(Moralis, transferProcessor, {
                        noteObjectId: noteId,
                        notePrice: note.price,
                        noteWriterAddress: noteWriterEthAddress,
                        buyerAddress: userEthAddress,
                      });
                    }}
                  >
                    Pay {note.price} Anno token
                  </button>
                </div>
              </div>
            );
          }
        })}
      </>
    );
  }, [notes, user]);

  /*const buyNote = async (noteHash: string)=> {
      const notes = Moralis.Object.extend("Notes");
      const query = new Moralis.Query(notes);
      const _noteOfPDF = await query.equalTo("noteHash", noteHash);
      const noteOfPDF = await _noteOfPDF.find();
      const buyingNote = noteOfPDF[0];

      const currentBuyers = buyingNote.get("buyers");
      currentBuyers.push(user?.get("username"));
      buyingNote.set("buyers", currentBuyers);

      buyingNote.save();
  }*/

  const jumpToNote = (note: Note) => {
    if (noteEles.has(note.id)) {
      noteEles.get(note.id)?.scrollIntoView();
    }
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {notes.map(note => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter(area => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: 'yellow',
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation),
                )}
                onClick={() => jumpToNote(note)}
                ref={(ref): void => {
                  noteEles.set(note.id, ref as HTMLElement);
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

  const { jumpToHighlightArea } = highlightPluginInstance;

  return (
    <div
      style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div className="pdf-wrapper">
        <div className="pdf-content">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
            <Viewer fileUrl={pdffileUrl} plugins={[highlightPluginInstance]} />
          </Worker>
        </div>
      </div>
      {writingMode && <div className="post-list">{writeNoteContainer}</div>}
      {!writingMode && <div className="post-list">{writtenNoteContainer}</div>}
    </div>
  );
};

export default PdfPage;
