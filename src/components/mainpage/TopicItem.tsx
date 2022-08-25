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
        <div>
          {topic === 'Arts' ? (
            <img
              className="topicImage"
              src={require('../../images/Arts.png')}
            />
          ) : topic === 'Astronomy' ? (
            <img
              className="topicImage"
              src={require('../../images/Astronomy.png')}
            />
          ) : topic === 'Biochemistry' ? (
            <img
              className="topicImage"
              src={require('../../images/Biochemistry.png')}
            />
          ) : topic === 'BlockChain' ? (
            <img
              className="topicImage"
              src={require('../../images/BlockChain.png')}
            />
          ) : topic === 'Business' ? (
            <img
              className="topicImage"
              src={require('../../images/Business.png')}
            />
          ) : topic === 'Chemistry' ? (
            <img
              className="topicImage"
              src={require('../../images/Chemistry.png')}
            />
          ) : topic === 'Computer Science' ? (
            <img
              className="topicImage"
              src={require('../../images/ComputerScience.png')}
            />
          ) : topic === 'Earth Science' ? (
            <img
              className="topicImage"
              src={require('../../images/EarthScience.png')}
            />
          ) : topic === 'Engineering' ? (
            <img
              className="topicImage"
              src={require('../../images/Engineering.png')}
            />
          ) : topic === 'Mathematics' ? (
            <img
              className="topicImage"
              src={require('../../images/Mathematics.png')}
            />
          ) : topic === 'Immunology' ? (
            <img
              className="topicImage"
              src={require('../../images/Immunology.png')}
            />
          ) : topic === 'Medicine' ? (
            <img
              className="topicImage"
              src={require('../../images/Medicine.png')}
            />
          ) : topic === 'Neuroscience' ? (
            <img
              className="topicImage"
              src={require('../../images/Neuroscience.png')}
            />
          ) : topic === 'Physics' ? (
            <img
              className="topicImage"
              src={require('../../images/Physics.png')}
            />
          ) : (
            <img
              className="topicImage"
              src={require('../../images/SocialScience.png')}
            />
          )}
        </div>
        <div className="topicText">{topic}</div>
      </div>
    </>
  );
};

export default TopicItem;
