import React from 'react';
import { Link } from 'react-router-dom';
import { TextArea, Icon } from 'web3uikit';
import { useState, useCallback } from 'react';
import UserPost from '../components/mainpage/UserPost';
import './Profile.scss';

const Profile = () => {
  return (
    <>
      This is Profile Page
      <div className='userinfo'>
        
      </div>
      <div>
        NFT Token
      </div>
      <div className="mainpage">
        작성글 리스트
        <UserPost title = "title1" content = "content1"/>
      </div>
      <div>
        구매글 pdf 리스트
      </div>
    </>
  );
};

export default Profile;
