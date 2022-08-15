import React from 'react';
import { Input } from 'web3uikit';
import TopicItem from './TopicItem';
import './TopicList.scss';

interface topicProps {
  topics: string[];
}

const TopicList = ({ topics }: topicProps) => {
  return (
    <>
      <div className="topicListWrapper">
        {topics.map((topic, index) => (
          <div className="topicItemWrapper" key={index}>
            <TopicItem topic={topic} />
          </div>
        ))}
      </div>
    </>
  );
};

export default TopicList;
