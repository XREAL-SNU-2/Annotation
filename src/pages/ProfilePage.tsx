import { Note } from 'functions/uplaodNote';
import React from 'react';
import { useMoralis } from 'react-moralis';
import Header from '../components/common/Header';
import '../styles/ProfilePage.scss';

function ProfilePage() {
    const { Moralis } = useMoralis();
    Moralis.start({appId: "rMCHTBGYR9zSvyLy9AhXq943Kkq1u7ADKoZjOLIs", serverUrl: "https://frer4xw5obeo.usemoralis.com:2053/server"});
    const user = Moralis.User.current();
    const [boughtPDFs, setBoughtPDFs] = React.useState<any[]>();
    const [writtenNotes, setWrittenNotes] = React.useState<any[]>();
    const [boughtNotes, setBoughtNotes] = React.useState<any[]>();
    
    React.useEffect(() => {
        const getPDFs = async () => {
            const PDF = Moralis.Object.extend("PDFs");
            const queryOfPDF = new Moralis.Query(PDF);
            const _boughtPDFs = await queryOfPDF.equalTo("buyers", "MJ");
            const boughtPDFs = await _boughtPDFs.find();
            
            setBoughtPDFs(boughtPDFs);
        }

        const getBoughtNotes = async () => {
            const Note = Moralis.Object.extend("Notes");
            const queryOfNote = new Moralis.Query(Note);
            const _boughtNotes = await queryOfNote.equalTo("buyers", "MJ");
            const boughtNotes = await _boughtNotes.find();

            setBoughtNotes(boughtNotes);
        }

        const getWrittenNotes = async () => {
            const Note = Moralis.Object.extend("Notes");
            const queryOfNote = new Moralis.Query(Note);
            const _writtenNotes = await queryOfNote.containedIn("noteWriter", [
                "MJ"
            ]);
            const writtenNotes = await _writtenNotes.find();

            setWrittenNotes(writtenNotes);
        }
        
        getPDFs();
        getBoughtNotes();
        getWrittenNotes();
    }, []);

    const boughtPdfList = React.useMemo(() => {
        if(boughtPDFs) {
            return (
                <>
                    {boughtPDFs.map((boughtPDF, index) => {
                        return (
                            <div key = {index} className = "pdf">
                                {boughtPDF.get("title")}
                            </div>
                        )
                    })}
                </>
            )
        } else  {
            return (
                <>
                
                </>
            )
        }
    }, [boughtPDFs]);

    const boughtNoteList = React.useMemo(() => {
        if(boughtNotes) {
            return (
                <>
                    {boughtNotes.map((boughtNote, index) => {
                        return (
                            <>
                                <div className="informationContainer" key = {index}>
                                    <div className="informationTitle">
                                        {boughtNote.get("noteTitle")}
                                    </div>
                                    <div className="informationDetail">
                                        {boughtNote.get("noteDetail")}
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </>
            )
        } else {
            return (
                <>
                
                </>
            )
        }
    }, [boughtNotes]);

    const writtenNoteList = React.useMemo(() => {
        if(writtenNotes) {
            return (
                <>
                    {writtenNotes.map((writtenNote, index) => {
                        return (
                            <>
                                <div className="informationContainer" key = {index}>
                                    <div className="informationTitle">
                                        {writtenNote.get("noteTitle")}
                                    </div>
                                    <div className="informationDetail">
                                        {writtenNote.get("noteDetail")}
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </>
            )
        } else {
            return (
                <>
                
                </>
            )
        }
    }, [writtenNotes])

    const userInformationContainer = React.useMemo(() => {
        return (
            <>
                <div className="userProfile">
                    <div className="profileImageContainer">
                        <div className="profileImage"></div>
                        <div className="level"></div>
                    </div>
                    <div className="name">{
                        user?.get("name")
                    }</div>
                </div>
                <div className="userIntroduction">
                    <div className="name">Introduce yourself</div>
                    <div className="detail"></div>
                    <div className="personalInformationContainer">
                        <div className="name">{user!.get("name")}</div>
                        <div className="email">{user?.get("email")}</div>
                        <div className="phoneNumber">{user?.get("phoneNumber")}</div>
                    </div>
                </div>
                <div className="tokenContainer">
                    <div className="title">보유 토큰 수량</div>
                    <div className="tokenCount">800</div>
                    <button className="buyToken">토큰 구매하기</button>
                </div>
            </>
        )
    }, [user]);

    return (
        <>
            <div className="page profile">
                <div className="body">
                    <div className="userInformation middleAlign">
                        {userInformationContainer}
                    </div>
                    <div className="badgesContainer">
                        <div className="containerTitle">NFT Token</div>
                        <div className="badgesList">
                            {[...Array(6)].map((key) => {
                                return (
                                    <>
                                        <div className="badge"></div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className="InformationContainer middleAlign" style={{"marginTop": "77px"}}>
                        <div className="containerTitle">작성글 리스트</div>
                        <div className="InformationList">
                            <div className="InformationListScroll">
                                {writtenNoteList}
                            </div>
                        </div>
                    </div>
                    <div className="InformationContainer middleAlign">
                        <div className="containerTitle">구매글 pdf 리스트</div>
                        <div className="InformationList pdf">
                            <div className="InformationListScroll">
                                {boughtPdfList}
                            </div>
                        </div>
                    </div>
                    <div className="InformationContainer middleAlign">
                        <div className="containerTitle">구매글 리스트</div>
                        <div className="InformationList">
                            <div className="InformationListScroll">
                                {boughtNoteList}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;