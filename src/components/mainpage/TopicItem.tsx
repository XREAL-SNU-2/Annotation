import React from 'react';
import './TopicItem.scss';

type topicProps = {
  topic: string;
};
const TopicItem = ({ topic }: topicProps) => {
  const link = `../../images/${topic}.png`;
  return (
    <>
      <div className="topicContainer">
        <img className="topicImage" src={require(link)} />
        <div className="topicText">{topic}</div>
      </div>
    </>
  );
};

export default TopicItem;
