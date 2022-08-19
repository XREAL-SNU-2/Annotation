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
import { useMoralis } from 'react-moralis';
import { useLocation } from 'react-router-dom';

interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
  price: number;
  good: number;
  bad: number;
  author: string;
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
  const [noteAuthor, setNoteAuthor] = React.useState<string>('');
  const [pdffileUrl, setPdfFileUrl] = React.useState<string>(
    'https://ipfs.io/ipfs/QmbXiqFbSBqikhNLLb5vKCHpyegcXTJ7g4wpBc1UqTGM3g?filename=session%20messenger.pdf',
  );
  //Moralis Pdf
  const location = useLocation();
  const pdfFileName = (location.state as CustomizedState).pdfName;
  const { Moralis } = useMoralis();
  React.useEffect(() => {
    async function getPDF() {
      try {
        const pdfs = Moralis.Object.extend('PDFs');
        const query = new Moralis.Query(pdfs);
        console.log(pdfFileName + 'this is pdf name');
        query.equalTo('title', pdfFileName);
        const results = await query.find();

        setPdfFileUrl(results[0].get('PDFFile'));
      } catch (error) {
        console.error(error);
      }
    }

    getPDF();
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
    setNoteAuthor(event?.target.value as string);
  };

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
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
          <Button onClick={props.toggle}>
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
          author: noteAuthor,
        };
        setNotes(notes.concat([note]));
        props.cancel();
        setNoteAuthor('');
        setNotePrice(0);
      }
    };
    //left: `${props.selectionRegion.left}%`,
    //top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
    return (
      <div
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
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
            <Viewer fileUrl={pdffileUrl} plugins={[highlightPluginInstance]} />
          </Worker>
        </div>
      </div>
      {writingMode && (
        <div
          style={{
            borderRight: '1px solid rgba(0, 0, 0, 0.3)',
            width: '25%',
            overflow: 'auto',
          }}
        >
          <div>
            <text>Noted By </text>
            <input></input>
          </div>
          <div>
            <text>제목: </text>
            <input></input>
          </div>
          <div>
            <PostingWritingPage
              setPostValue={setNoteValue}
            ></PostingWritingPage>
          </div>

          <button onClick={OnReadingMode}>취소</button>
        </div>
      )}
      {!writingMode && (
        <div className="post-list">
          {notes.length === 0 && <div>There is no note</div>}
          {notes.map(note => {
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
                      {note.quote}
                      <text className="note-authorName">
                        Noted by {note.author}
                      </text>
                    </blockquote>
                    <div>
                      <MDEditor.Markdown
                        source={note.content}
                        style={{ backgroundColor: '#FFFFFF', height: 190 }}
                      />
                    </div>
                  </div>
                  <text className="note-boldword">Good</text>
                  <text className="note-mideumword">{note.good}</text>
                  <text className="note-boldword">Bad</text>
                  <text className="note-mideumword">{note.bad}</text>
                  <button className="buy-button">
                    Pay {note.price} Anno token
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PdfPage;
