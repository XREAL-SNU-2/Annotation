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
import { 
  pageNavigationPlugin,
  RenderCurrentPageLabelProps
} from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PostingWritingPage from '../components/mainpage/PostWritingPage';
import MDEditor, { commands } from '@uiw/react-md-editor';
import './PdfPage.scss';
import { Input } from 'web3uikit';
import {
  useMoralis,
  useWeb3ExecuteFunction,
  useWeb3Transfer,
} from 'react-moralis';
import { useLocation } from 'react-router-dom';
import { getNote, uploadNote } from '../functions/uplaodNote';
import { buyNote } from '../functions/buyNote';
import hash from 'object-hash';
import ViewNoteContainer from 'components/ViewNoteContainer';
import WrittenNoteContainer from 'components/WrittenNoteContainer';
export interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
  price: number;
  good: string[];
  bad: string[];
  author: string;
  noteHash: string;
  buyers: string[];
  title: string;
  labelColor: string;
  writerAddress: string;
}

interface CustomizedState {
  pdfName: string;
}

const labelColors = ["rgba(3, 239, 133, 1)", "rgba(255, 153, 226, 1)", "rgba(3, 168, 239, 1)"];

const PdfPage = () => {
  const [message, setMessage] = React.useState('');
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [writtingMode, setWrittingMode] = React.useState<boolean>(false);
  const [viewMode, setViewMode] = React.useState<boolean>(false);
  const [selectedNote, setSelectedNote] = React.useState<Note>();
  const [noteValue, setNoteValue] = React.useState<string>('');
  const [noteTitle, setNoteTitle] = React.useState<string>('');
  const [notePrice, setNotePrice] = React.useState<number>(0);
  const [userName, setUserName] = React.useState<string>('');
  const [newLabelColorIndex, setNewLabelColorIndex] = React.useState<number>(0);
  const [reload, setReload] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
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
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel } = pageNavigationPluginInstance;

  React.useEffect(() => {
    if(reload) {
      window.location.reload();
      setReload(false);
    }
  }, [reload])

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
          content: note.get("noteDetail"),
          highlightAreas: note.get("notePosition"),
          quote: note.get("noteSelectedText"),
          price: note.get("notePrice"),
          good: note.get("noteGoods"),
          bad: note.get("noteBads"),
          author: note.get("noteWriter"),
          noteHash: note.get("noteHash"),
          buyers: note.get("buyers"),
          title: note.get("noteTitle"),
          labelColor: note.get("labelColor"),
          writerAddress: note.get("noteWriterAddress")
        }
        noteList.push(newNote);
      })
      const _newLabelColorIndex = labelColors.indexOf(noteList[noteList.length - 1].labelColor);
      setNewLabelColorIndex((_newLabelColorIndex + 1) % 3);

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
    setWrittingMode(true);
  };
  const OnReadingMode = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setWrittingMode(false);
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
              setNoteTitle("");
              setNotePrice(0);
              setWrittingMode(true);
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
          good: [],
          bad: [],
          author: userName,
          noteHash: "",
          buyers: [],
          title: "",
          labelColor: "",
          writerAddress: ""
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

  const addNote = (highlightAreas: any, selectedText: any, cancel: any, labelColor: string) => {
    if (noteValue !== '') {
      const note: Note = {
        id: ++noteId,
        content: noteValue,
        highlightAreas: highlightAreas,
        quote: selectedText,
        price: notePrice,
        good: [],
        bad: [],
        author: userName,
        noteHash: "",
        buyers: [],
        title: noteTitle,
        labelColor: labelColor,
        writerAddress: ""
      };
      setNotes(notes.concat([note]));
      cancel;
    }
  };

  const writeNoteContainer = React.useMemo(() => {
    return (
      <>
        <div className="writeNoteContainer">
          <div className="label" style={{"backgroundColor": labelColors[newLabelColorIndex]}}></div>
          <div className="author">
            <text>Noted By {userName}</text>
          </div>
          <input type="text" className={"title" + ((noteTitle === "") ? " empty" : "")} value={noteTitle} onChange = {(e) => setNoteTitle(e.target.value)} />
          <div className="writeContainer">
            <PostingWritingPage
              setPostValue={setNoteValue}
            ></PostingWritingPage>
          </div >
          <div className="priceContainer">
            <div className="priceText">
              {"I NEED "}
              <input type="text" className="price" value = {notePrice} onChange = {(e) => setNotePrice(Number(e.target.value))} />
              {" TOKEN"}
            </div>
            <button className="submit"
            onClick={() => {
              addNote(
                notePropsHighLightArea,
                notePropsSelectedText,
                notePropsCancel,
                labelColors[newLabelColorIndex]
              );
              uploadNote(Moralis, contractProcessor, {
                noteTitle: noteTitle,
                noteDetail: noteValue,
                noteWriter: userName,
                noteWriterAddress: userEthAddress,
                notePosition: notePropsHighLightArea,
                notePrice: notePrice,
                pdfFileName: pdfFileName,
                noteSelectedText: notePropsSelectedText,
                labelColor: labelColors[newLabelColorIndex],
                writerAddress: userEthAddress
              });
              setNewLabelColorIndex((newLabelColorIndex + 1) % 3);
              setWrittingMode(false);
            }}
          >SUBMIT</button>
          </div>
          <button className="cancel"
            onClick={() => {
              notePropsCancel;
              setWrittingMode(false);
            }}
          >{"<"}</button>
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
    noteTitle
  ]);

  const jumpToNote = (note: Note) => {
    if (noteEles.has(note.id)) {
      noteEles.get(note.id)?.scrollIntoView();
    }
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {notes.map((note, index: number) => (
        <React.Fragment key={index}>
          {note.highlightAreas
            .filter(area => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: note.labelColor,
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation),
                )}
                onClick={() => {
                  jumpToNote(note);
                }}
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

  const WrittenNoteContainerByPage = React.useMemo(() => {
    return (
      <WrittenNoteContainer notes = {notes} jumpToHighlightArea = {jumpToHighlightArea} setViewMode = {setViewMode} setSelectedNote = {setSelectedNote} userEthAddress = {userEthAddress} setReload = {setReload} currentPage = {currentPage}></WrittenNoteContainer>
    )
  }, [currentPage])

  return (
    <div className="pdfPage">
      <CurrentPageLabel>
        {(props: RenderCurrentPageLabelProps) => {
          setCurrentPage(props.currentPage);
          return (
            <></>
          )
        }}
      </CurrentPageLabel>
      <div className="pdf-wrapper">
        <div className="pdf-content">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
            <Viewer fileUrl={pdffileUrl} plugins={[highlightPluginInstance, pageNavigationPluginInstance]} />
          </Worker>
        </div>
      </div>
      {(!viewMode && writtingMode) && <div className="post-list">{writeNoteContainer}</div>}
      {(!viewMode && !writtingMode) && <div className="post-list">
        {WrittenNoteContainerByPage}
      </div>}
      {viewMode && <div className="post-list">
        {<ViewNoteContainer note = {selectedNote!} notePropsCancel = {notePropsCancel} setViewMode = {setViewMode}></ViewNoteContainer>}
      </div>}
    </div>
  );
};

export default PdfPage;
