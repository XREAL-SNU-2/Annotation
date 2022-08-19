import React from 'react';
import Header from '../components/common/Header';
import '../styles/ProfilePage.scss';

function ProfilePage() {
    return (
        <>
            <div className="page profile">
                <div className="body">
                    <div className="userInformation middleAlign">
                        <div className="userProfile">
                            <div className="profileImageContainer">
                                <div className="profileImage"></div>
                                <div className="level"></div>
                            </div>
                            <div className="name">Jina Kim</div>
                        </div>
                        <div className="userIntroduction">
                            <div className="name">Introduce yourself</div>
                            <div className="detail"></div>
                            <div className="personalInformationContainer">
                                <div className="name">Jina Kim</div>
                            </div>
                        </div>
                        <div className="tokenContainer">
                            <div className="title">보유 토큰 수량</div>
                            <div className="tokenCount">800</div>
                            <button className="buyToken">토큰 구매하기</button>
                        </div>
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
                                {[...Array(5)].map((key) => {
                                    return (
                                        <>
                                            <div className="informationContainer">
                                                <div className="informationTitle">
                                                A new frontier 
                                                </div>
                                                <div className="informationDetail">
                                                    {`Amet minim mollit 
                                                    non deserunt 
                                                    ullamco est sit 
                                                    aliqua dolor do amet
                                                    sint. Velit officia 
                                                    consequat duis `}
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="InformationContainer middleAlign">
                        <div className="containerTitle">구매글 pdf 리스트</div>
                        <div className="InformationList">
                            <div className="InformationListScroll">
                                {[...Array(6)].map((key) => {
                                    return (
                                        <>
                                            <div className="pdf"></div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="InformationContainer middleAlign">
                        <div className="containerTitle">구매글 리스트</div>
                        <div className="InformationList">
                            <div className="InformationListScroll">
                                {[...Array(5)].map((key) => {
                                    return (
                                        <>
                                            <div className="informationContainer">
                                                <div className="informationTitle">

                                                </div>
                                                <div className="informationDetail">

                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;