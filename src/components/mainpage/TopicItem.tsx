import React from 'react';
import './TopicItem.scss';

type topicProps = {
  topic: string;
};
const TopicItem = ({ topic }: topicProps) => {
  return (
    <>
      <div className="TopicItem">{topic}</div>
    </>
  );
};

export default TopicItem;
