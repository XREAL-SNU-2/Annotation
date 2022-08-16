import * as React from 'react';
import {
    highlightPlugin,
    HighlightArea,
    MessageIcon,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
} from '@react-pdf-viewer/highlight';
import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PostingWritingPage from 'components/mainpage/PostWritingPage';
import MDEditor from '@uiw/react-md-editor';
import { Input } from 'web3uikit';

interface DisplayNotesSidebarExampleProps {
    fileUrl: string;
}

interface Note {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
    price: number;
    good: number;
    bad: number
}

const PdfPage: React.FC<DisplayNotesSidebarExampleProps> = ({fileUrl}) => {
    const [message, setMessage] = React.useState('');
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [writingMode, setWritingMode] = React.useState<boolean>(false);
    const [noteValue, setNoteValue] = React.useState<string>("");
    const [notePrice, setNotePrice] = React.useState<number>(0);
    let noteId = notes.length;

    const noteEles: Map<number, HTMLElement> = new Map();
    
    const OnWritingMode = (event?: React.MouseEvent<HTMLButtonElement>) =>{
        setWritingMode(true);
    }
    const OnReadingMode = (event?: React.MouseEvent<HTMLButtonElement>) =>{
        setWritingMode(false);
    }

    const OnPriceValueChange = (event?: React.ChangeEvent<HTMLInputElement>)=>{
        setNotePrice((event?.target.value as unknown) as number);
    }
    

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
    ); ////props.toggle

    /*const addPost = () => {
        if (noteValue !== '') {
            const note: Note = {
                id: ++noteId,
                content: noteValue,
                highlightAreas: props.highlightAreas,
                quote: props.selectedText,
            };
            setNotes(notes.concat([note]));
            props.cancel();
            setWritingMode(false);
        }
    };*/

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
                    bad: 0
                };
                setNotes(notes.concat([note]));
                props.cancel();
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
                    left: `${props.selectionRegion.left*0.7}%`,
                    top: `${(props.selectionRegion.top + props.selectionRegion.height)*0.5}%`,
                    width: 500,
                    height: 800,
                    zIndex: 1,
                }}
            >
                <div>
                    Noted by <input placeholder='Name'></input>
                </div>
                <div>
                    Price is <input onChange={OnPriceValueChange} placeholder="0" type="number"></input> Anno token
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
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
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
            <div
                style={{
                    flex: '1 1 0',
                    overflow: 'auto',
                }}
            >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance]} />
                </Worker>
            </div>
            {writingMode&&(
                <div style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                    width: '25%',
                    overflow: 'auto',
                }}>
                    <div>
                        <text>Noted By </text>
                        <input></input>
                    </div>
                    <div>
                        <text>제목: </text>
                        <input></input>
                    </div>
                    <div>
                        <PostingWritingPage setPostValue={setNoteValue}></PostingWritingPage>
                    </div>
                    
                    <button onClick={OnReadingMode}>취소</button>
                </div>
            )
            }
            {!writingMode&&(
                <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                    width: '25%',
                    overflow: 'auto',
                }}
            >
                {notes.length === 0 && <div style={{ textAlign: 'center' }}>There is no note</div>}
                {notes.map((note) => {
                    return (
                        <div key={note.id} style={{
                            borderBottom: '1px solid rgba(0, 0, 0, .3)',
                            cursor: 'pointer',
                            padding: '8px',
                        }}>
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
                                </blockquote>
                                <div>
                                    <MDEditor.Markdown source={note.content} style={{ backgroundColor: '#FFFFFF', minHeight: 150 }}/>
                                </div>
                                
                            </div>
                            <button>Pay {note.price} Anno token</button>
                        </div>
                    );
                })}
            </div>
            )

            }
        </div>
    );
};

export default PdfPage;