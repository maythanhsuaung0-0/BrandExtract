import React, { useState, useRef } from 'react';
import { Button } from "@swc-react/button";
import '../components/css/upload-assets.css'

const UploadAssetPage = () => {
  const [isdropping, setIsDropping] = useState(false);
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState([]);
  const dropZoneRef = useRef(null);
  function handleUrlChange(event) {
    event.preventDefault();
    setUrl(event.target.value);
  }
  function handleClick() {
    // use the url to do something, like fetching data or uploading
  }
  function handleDragOver(event) {
    event.preventDefault();
    setIsDropping(true);
  }
  function handleFileInputChange(event) {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      console.log("Files selected:", selectedFiles);
      setFiles(selectedFiles);
    }
  }
  function handleFileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      console.log("Files dropped:", files);
      setFiles(files);
      setIsDropping(false);
      // Handle file upload logic here
    }
  }

  return (
    <div className="container">
      <h3 className='page-title'>Upload Asset Page</h3>
      <p>Drop in a brand file or paste a URL, and we’ll bring its theme to life.</p>


      <div className='upload'>
        <div className='url'>
          <div>
            <label htmlFor="url" className='label'>Enter a URL</label>
            <input type="text" id="url" placeholder="type your url" value={url} onChange={handleUrlChange}
              className='input-url' />
          </div>
          <Button className='btn' size="m" onClick={handleClick}>
            Enter URL
          </Button>
        </div>
        <span className='span'>OR</span>
        <div ref={dropZoneRef}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          className={`drag-drop-area ${isdropping ? 'dropping' : ''}`}>
          <div className="drag-drop-content">
            <div className='upload-file' size="m" >
              <Button className='btn' size="m">
                <span className='upload-icon'>
                  Upload Files
                </span>
              </Button>
              <input type="file" onChange={handleFileInputChange} className='input-file' />
            </div>
            <span className='span'>or</span>
            <div>Drop your files here</div>
          </div>
        </div>
      </div>
      {/* show extracted brand dna here */}
      <div className="extracted-brand-dna">
        <h3>Extracted Brand DNA</h3>
        <div className='brand-dna-item'>
          <span>Colors: </span>
          <div className=' color-list'>
            <div className='color' style={{ backgroundColor: "lightblue" }}></div>
            <div className='color' style={{ backgroundColor: "red" }}></div>
            <div className='color' style={{ backgroundColor: "lightpink" }}></div>
          </div>
        </div>
        <div className='brand-dna-item font'>
          <span>Font</span>
          <div className='sub-title'>
            <div>
              Roboto (primary)
            </div>
            <div>
              Roboto (secondary)
            </div>

          </div>
        </div>
        <div className='brand-dna-item logo'>
          <span>Logo</span>
          <div className='logo-image'>
          </div>
        </div>
      </div>

    </div >

  )
}
export default UploadAssetPage;
