import React from 'react';
import { Input } from 'web3uikit';
import TopicItem from './TopicItem';
import './TopicList.scss';

const TopicList = () => {
  return (
    <>
      <div className="topicListWrapper">
        <div className="topicItemWrapper">
          <TopicItem />
        </div>
        <div className="topicItemWrapper">
          <TopicItem />
        </div>
        <div className="topicItemWrapper">
          <TopicItem />
        </div>
      </div>
    </>
  );
};

export default TopicList;
