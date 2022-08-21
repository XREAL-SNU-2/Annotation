import React from 'react';
import './TopicItem.scss';

type topicProps = {
  topic: string;
};
const TopicItem = ({ topic }: topicProps) => {
  return (
    <>
      <div className="topicContainer">
        <img
          className="topicImage"
          src={require('../../images/topicLogo.png')}
        />
        <div className="topicText">{topic}</div>
      </div>
    </>
  );
};

export default TopicItem;
