import React, { useState, useRef } from 'react';
import { Button } from "@swc-react/button";
import '../components/css/upload-assets.css'
import { useAuth } from '../authContext'
import readFile from '../services/util';
import { extractBrand } from '../services/extract';
import Login from '../components/login';
const UploadAssetPage = () => {
  const { token } = useAuth()
  const [isdropping, setIsDropping] = useState(false);
  const [extractedData, setExtractedData] = useState(null)
  const [url, setUrl] = useState('');
  const [chosenUrl, setChosenUrl] = useState(null)
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null)
  const dropZoneRef = useRef(null);
  function handleUrlChange(event) {
    event.preventDefault();
    setUrl(event.target.value);
  }
  function handleClick() {
    // use the url to do something, like fetching data or uploading
    console.log('url', url)
    setChosenUrl(url)
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
      readFile(selectedFiles[0], setPreviewUrl)
    }
  }
  function handleFileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      console.log("Files dropped:", files);
      setFiles(files);
      setIsDropping(false);

      readFile(files[0], setPreviewUrl)
      // Handle file upload logic here
    }
  }
  async function createExtraction() {
    let data = {
      file: files[0],
      url: chosenUrl
    }
    let formData = new FormData()
    if (files[0]) {
      formData.append("file", files[0])
    }
    if (chosenUrl) {
      formData.append("url", chosenUrl)
    }


    if (files[0] !== null || chosenUrl !== null) {
      let res = await extractBrand(formData, token)
      if (res.status === 200) {
        setExtractedData(res.data)
        console.log(res.data)
      }
      else {
        toast.error("Something went wrong, cannot extract brand")
      }
    }
  }
  return (
    <div className="container">
      {previewUrl || chosenUrl ?
        <div>
          <img src={previewUrl || chosenUrl} alt="your selected file" className='logoFile' />
          <Button className='margin-md' disabled={token ? false : true} onClick={createExtraction}>Extract Brand</Button>
          {!token && <Login />}
        </div>
        :
        <div>
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
        </div>
      }
      {/* show extracted brand dna here */}
      {extractedData &&
        <div className="extracted-brand-dna">
          <h3>Extracted Brand DNA</h3>
          <div className='brand-dna-item'>
            <span>Colors: </span>
            <div className=' color-list'>
              {extractedData.colors?.map((color,id) =>
                <div key={id} className='color' style={{ backgroundColor: color }}></div>
              )
              }
            </div>
          </div>
          <div className='brand-dna-item font'>
            <span>Font</span>
            <div className='sub-title'>
              {extractedData.fonts?.map((font,id) =>
                <div key={id}>
                  {font}
                  {id === 0 && "primary"}
                </div>
              )
              }
            </div>
          </div>
          <div className='brand-dna-item logo'>
            <span>Logo</span>
          {extractedData.logo_url?
            <img src={logo_url} className='logo-image' alt="logo" />
            :
            <div className='logo-image'>
            </div>
          }
          </div>
        </div>
      }
    </div >

  )
}
export default UploadAssetPage;
