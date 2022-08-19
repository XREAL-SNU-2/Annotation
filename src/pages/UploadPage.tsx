import React from 'react';
import { Link } from 'react-router-dom';
import { TextArea, Icon } from 'web3uikit';
import { useState, useRef } from 'react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import TopicList from '../components/mainpage/TopicList';
import BookList from '../components/mainpage/BookList';
import './UploadPage.scss';

const Uploadpage = () => {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const inputPDF = useRef<any>(null);
  const inputThumbnail = useRef<any>(null);
  const [selectedPDF, setSelectedPDF] = useState<string>();
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>();
  const [PDF, setPDF] = useState<File>();
  const [info, setInfo] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [topic, setTopic] = useState<string>();
  const [thumbnail, setThumbnail] = useState<File>();
  const contractProcessor = useWeb3ExecuteFunction();

  async function uploadPDF() {
    if (!title) return;
    const PDFs = Moralis.Object.extend('PDFs');
    const newPDF = new PDFs();

    let pdf;
    let thmnail;
    if (PDF) {
      const pdfData = PDF;
      const file = new Moralis.File(title, pdfData);
      await file.saveIPFS();
      pdf = file.ipfs();
    } else {
      pdf = 'NO PDF';
    }
    if (thumbnail) {
      const thumbnailData = thumbnail;
      const file2 = new Moralis.File(title, thumbnailData);
      await file2.saveIPFS();
      thmnail = file2.ipfs();
    } else {
      thmnail = 'NO THUMBNAIL';
    }
    newPDF.set('PDFFile', pdf);
    newPDF.set('thumbnail', thmnail);
    newPDF.set('title', title);
    newPDF.set('info', info);
    newPDF.set('topic', topic);
    newPDF.set('uploaderAcc', user?.attributes.ethAddress);
    newPDF.set('uploaderName', user?.attributes.username);

    await newPDF.save();
    window.location.reload();
  }
  const onPDFImageClick = () => {
    inputPDF.current?.click();
  };
  const onThumbnailImageClick = () => {
    inputThumbnail.current?.click();
  };
  const changeThumbnailHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;
    const img = event.target.files[0];
    setThumbnail(img);
    setSelectedThumbnail(URL.createObjectURL(img));
  };

  const changePDFHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const pdf = event.target.files[0];
    setPDF(pdf);
    setSelectedPDF(URL.createObjectURL(pdf));
  };
  return (
    <>
      <div className="tweetBox">
        <TextArea
          label=""
          name="pdfTitle"
          value="pdfTitle"
          onChange={e => setTitle(e.target.value)}
          width="95%"
        ></TextArea>

        <TextArea
          label=""
          name="pdfTopic"
          value="pdfTopic"
          onChange={e => setTopic(e.target.value)}
          width="95%"
        ></TextArea>
        <TextArea
          label=""
          name="pdfInfo"
          value="pdfInfo"
          onChange={e => setInfo(e.target.value)}
          width="95%"
        ></TextArea>
        {selectedThumbnail && (
          <img src={selectedThumbnail} className="tweetImg"></img>
        )}
        <div className="imgOrTweet">
          <div className="imgDiv" onClick={onThumbnailImageClick}>
            <input
              type="file"
              name="file"
              ref={inputThumbnail}
              onChange={changeThumbnailHandler}
              style={{ display: 'none' }}
            />
            <Icon fill="#1DA1F2" size={20} svg="image"></Icon>
          </div>
          {selectedPDF && <img src={selectedPDF} className="tweetImg"></img>}
          <div className="imgDiv" onClick={onPDFImageClick}>
            <input
              type="file"
              name="file"
              ref={inputPDF}
              onChange={changePDFHandler}
              style={{ display: 'none' }}
            />
            <Icon fill="#1DA1F2" size={20} svg="image"></Icon>
          </div>
          <div className="tweetOptions">
            <div className="tweet" onClick={uploadPDF}>
              Upload
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Uploadpage;
